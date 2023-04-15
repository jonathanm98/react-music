import React, {useEffect, useRef, useState} from 'react';
import {formatTime} from "../utils";

type Props = {
    selectedSongId: number | null;
    selectedSongTags: Object[];
}
const Player = ({selectedSongId, selectedSongTags}: Props): JSX.Element => {
        const [isPlaying, setIsPlaying] = useState<boolean>(false);
        const [progress, setProgress] = useState<number>(0);
        const audioRef = useRef<HTMLAudioElement>(null);
        const progressRef = useRef<HTMLDivElement>(null);


        const handlePlay = (): void => {
            console.log("play")
            if (audioRef.current) {
                audioRef.current.play().then(() => setIsPlaying(true));
            }
        };

        const handlePause = (): void => {
            console.log("pause")
            if (audioRef.current) {
                audioRef.current.pause();
                setIsPlaying(false);
            }
        }

        const handleTimeUpdate = (): void => {
            if (audioRef.current) {
                setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
            }
        };

        const handleEnd = (): void => {
            console.log("end")
            if (audioRef.current) {
                setIsPlaying(false);
            }
        };

        const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
            if (audioRef.current) {
                // Arrêter la lecture de l'audio
                audioRef.current.pause();
                setIsPlaying(false);

                const width = progressRef.current!.clientWidth;
                const clickX = e.nativeEvent.offsetX;
                const duration = audioRef.current.duration;
                let newTime = (clickX / width) * duration;

                // Mettre à jour la position de lecture de l'audio au clic initial
                setProgress((newTime / duration) * 100);

                // Écouter les événements "mousemove" et "mouseup" sur la fenêtre pour continuer la mise à jour de la position de lecture
                const handleMouseMove = (e: MouseEvent) => {
                    const newX = e.clientX - progressRef.current!.getBoundingClientRect().left;
                    newTime = (newX / width) * duration;
                    setProgress((newTime / duration) * 100);
                };

                const handleMouseUp = () => {
                    window.removeEventListener("mousemove", handleMouseMove);
                    window.removeEventListener("mouseup", handleMouseUp);
                    console.log(newTime)
                    audioRef.current!.currentTime = newTime;
                    audioRef.current!.play().then(() => setIsPlaying(true));
                };

                window.addEventListener("mousemove", handleMouseMove);
                window.addEventListener("mouseup", handleMouseUp);
            }
        };


        useEffect((): void => {
            console.log("useEffect")
            if (audioRef.current) {
                setIsPlaying(false);
                audioRef.current.load();
                audioRef.current.volume = 0.5;
            }
        }, [selectedSongId])


        return (
            <>
                <audio
                    ref={audioRef}
                    preload="auto"
                    src={"http://localhost:3000/music/stream/" + selectedSongId}
                    onLoadedMetadata={handlePlay}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleEnd}
                />
                <div className="audio-infos"></div>
                <div className="audio-controls">
                    <div className="top-part">
                        <button onClick={isPlaying ? handlePause : handlePlay}>
                            <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16"
                                 data-encore-id="icon">
                                {
                                    isPlaying ?
                                        <path
                                            d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
                                        :
                                        <path
                                            d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
                                }
                            </svg>

                        </button>
                    </div>

                    <div className="bottom-part">
                        <div onMouseDown={handleMouseDown} className="progress-bar-container"
                             style={{width: "80vw", height: "3px", padding: "10px 0"}}>
                            <div ref={progressRef} style={{width: "100%", height: "100%", backgroundColor: "#484747"}}
                                 className="progress-bar">
                                <div className="progress"
                                     style={{
                                         width: `${progress}%`,
                                         height: "100%",
                                         backgroundColor: "#ffffff",
                                     }}/>
                            </div>
                        </div>
                        <p>{audioRef.current && formatTime(audioRef.current.currentTime)}</p>
                        <p>{audioRef.current && audioRef.current?.duration ? formatTime(audioRef.current.duration) : "0.00"}</p>
                    </div>
                </div>
                <div className="audio-miscs">

                </div>
            </>
        );
    }
;

export default Player;
