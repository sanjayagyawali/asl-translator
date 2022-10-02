import { useCallback } from "react"; 
import Particles from "react-tsparticles"; 
import { loadFull } from "tsparticles"; 
import logo from './logo.svg'; 
import React from 'react'; 
import TextField from '@mui/material/TextField'; 
import Button from '@mui/material/Button'; 
import Stack from '@mui/system/Stack';

const App = () => {
    const [sentence, setSentence] = React.useState('');
    const [link, setLink] = React.useState(null);
    const handleChange = (event) => {
        setSentence(event.target.value);
    };

    const particlesInit = useCallback(async (engine) => {
    console.log(engine);
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
    
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);

  async function sendToBackend()
  {
    setLink(null);
    await fetch("http://localhost:5000/translate", {
        method: 'POST',
        body: JSON.stringify({
           words: sentence,
        }),
        headers: {
           'Content-type': 'application/json; charset=UTF-8',
        },})
        .then(res => res.json())
        .then(data => {
            setLink(data.link);
        })
        .catch(err => console.log(err));
  }

  return ( 
  
    <div> 
        <div className = "App"> 
            <header className = "App-header"> 
                <div> 
                    <Stack component="form" 
                        sx={{ width: '25ch', }} 
                        spacing={2} 
                        noValidate 
                        autoComplete="off" > 

                        <TextField 
                        id="sentence" 
                        label="Enter a Sentence" 
                        multiline variant="filled" 
                        fullWidth color="warning"
                        onChange={handleChange}
                        /> 
                        {sentence ? 
                        <Button onClick={() => sendToBackend()}
                            color = "secondary" 
                            variant="contained">Translate</Button> 
                            
                        : <Button onClick={() => sendToBackend()}
                            disabled
                            color = "secondary" 
                            variant="contained">Translate</Button> 
                        }
                        
                    </Stack> 
                </div> 
                <img src={logo} alt = "logo" height={150} width={150}/> 
                {link && <video src={link} controls autoPlay muted/>}
            </header> 
        </div> 
        

        <div id= "particles">
            
            <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
                background: {
                color: {
                    value: "#5f459d",
                },
                },
                
                fpsLimit: 120,
                interactivity: {
                events: {
                    onClick: {
                    enable: false,
                    mode: "push",
                    },
                    onHover: {
                    enable: true,
                    mode: "repulse",
                    },
                    resize: true,
                },
                modes: {
                    push: {
                    quantity: 4,
                    },
                    repulse: {
                    distance: 150,
                    duration: 0.4,
                    },
                },
                },
                particles: {
                color: {
                    value: "#ffffff",
                },
                links: {
                    color: "#ffffff",
                    distance: 150,
                    enable: true,
                    opacity: 0.5,
                    width: 1,
                },
                collisions: {
                    enable: false,
                },
                move: {
                    directions: "none",
                    enable: true,
                    outModes: {
                    default: "bounce",
                    },
                    random: false,
                    speed: 3,
                    straight: false,
                },
                number: {
                    density: {
                    enable: true,
                    area: 800,
                    },
                    value: 80,
                },
                opacity: {
                    value: 0.3,
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1, max: 5 },
                },
                },
                detectRetina: true,
            }}
            />
        </div>

    </div>
  );
};

export default App;