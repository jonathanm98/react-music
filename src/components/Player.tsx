import React, {useEffect, useRef, useState} from 'react';
import {formatTime} from "../utils";

type Props = {
    selectedSongId: number | null;
    selectedSongTags: Object[];
}
const Player = ({selectedSongId, selectedSongTags}: Props): JSX.Element => {
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const [progress, setProgress] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [newTime, setNewTime] = useState<number>(0);

    const handlePlay = (): void => {
        if (audioRef.current) {
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = (): void => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime * 100 / audioRef.current.duration);
        }
    };

    const handleEnd = (): void => {
        setProgress(0);
        setIsPlaying(true);
        handlePlay();
    };


    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>): void => {
        const div: EventTarget & HTMLDivElement = event.currentTarget;
        const width: number = div.offsetWidth;
        const x: number = event.clientX - div.offsetLeft;
        if (audioRef.current) {
            setIsPlaying(false);
            const newTime = x * audioRef.current.duration / width;
            console.log(x * audioRef.current.duration / width)

            const handleMouseMove = (event: MouseEvent): void => {
                const x: number = event.clientX - div.offsetLeft;
                audioRef.current.currentTime = x * audioRef.current.duration / width;
            };

            const handleMouseUp = (): void => {
                audioRef.current && (audioRef.current.currentTime = newTime);
                setIsPlaying(true);
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
            if (isPlaying) audioRef.current.play();
            else audioRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            setIsPlaying(true);
        }
    }, [selectedSongId]);


    return (
        <>
            <audio
                preload="auto"
                ref={audioRef}
                src={"http://localhost:3000/music/stream/" + selectedSongId}
                onCanPlayThrough={handleTimeUpdate}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnd}
            />
            <div className="audio-infos"></div>
            <div className="audio-controls">
                <div className="top-part">
                    <button onClick={handlePlay}>
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
                    <div onMouseDown={handleMouseDown} className="progress-bar"
                         style={{width: "80vw", height: "3px", padding: "10px 0", backgroundColor: "#484747"}}>
                        <p>{audioRef.current && formatTime(Math.floor(audioRef.current.currentTime))}</p>
                        <div className="progress"
                             style={{width: `${progress}%`, height: "100%", backgroundColor: "#ffffff"}}></div>
                    </div>
                </div>
            </div>
            <div className="audio-miscs">

            </div>
        </>
    );
};

export default Player;
