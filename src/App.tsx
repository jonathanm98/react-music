import {useEffect, useState, Suspense} from 'react';
import Player from './components/Player';
import axios from 'axios';

const App = () => {
    const [songActive, setSongActive] = useState<boolean>(false);
    const [selectedSongId, setSelectedSongId] = useState<string>("");
    const [selectedSongTags, setSelectedSongTags] = useState<Object[]>([]);

    const [songList, setSongList] = useState([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/music`).then((response) => {
            setSongList(response.data);
        });
    }, []);
    return (
        <div className="main-container">
            <h1>Spotify clone</h1>
            <div className="song-list" style={{display: "flex", flexWrap: "wrap", gap: "30px"}}>
                {songList?.length > 0
                    ? songList.map((song: { index: number, name: string, tags: any }) => (
                        <div
                            key={song.index}
                            className="song-container"
                            onClick={async () => {
                                setSelectedSongId(song.index.toString());
                                const tags = await axios.get<any[]>(`${import.meta.env.VITE_API_URL}/music/infos/${song.index}`);
                                setSelectedSongTags(tags.data);
                                setSongActive(true);
                            }}>
                            <p>{song.name}</p>
                        </div>
                    ))
                    : <div>Loading...</div>
                }
            </div>
            {songActive && <Player selectedSongTags={selectedSongTags} selectedSongId={selectedSongId}/>}
        </div>
    );
};

export default App;
