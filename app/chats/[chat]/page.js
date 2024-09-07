'use client'

import { Box, Typography, Stack, TextField, Button, Link} from "@mui/material";
import { useEffect, useState, useRef, classes} from "react";
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import SendIcon from '@mui/icons-material/Send';
import ReactMarkdown from 'react-markdown';
import {auth, db} from '../../firebase';
import { collection, addDoc, doc, setDoc, getDoc} from 'firebase/firestore';
import { useRouter } from "next/navigation";
import useLogout from '../../components/logout';
import {CircularProgress} from '@mui/material';


import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BoltIcon from '@mui/icons-material/Bolt';
import Person4Icon from '@mui/icons-material/Person4';
import SaveIcon from '@mui/icons-material/Save';
import LogoutIcon from '@mui/icons-material/Logout';
import { Save } from "lucide-react";


const col6 = ['#3D405B'] // Dark shade
const col2 = ['#E07A5F'] //red
const col3 = ['#81B29A'] //green
const col4 = ['#F4F1DE'] //white
const col5 = ['#F2CC8F'] //yellow
const col1 = '#191c35'; // Darker shade

export default function Home({params}) {
    const { chat } = params;
    

  const [messages, setMessages] = useState([]);
  
  const [mode, setMode] = useState('dark');
  const [bgOne, setBgOne] = useState("#D9D9D9");
  const [bgTwo, setBgTwo] = useState("#BDC3C7");
  const [bgThree, setBgThree] = useState("#FFFFFF");
  const [bgFour, setBgFour] = useState("#786fa6");
  const [colorOne, setcolorOne] = useState('#111');
  const [glowOne, setglowOne] = useState('0 0 30px 1px #786fa6');
  const [buttonOne, setbuttonOne] = useState('#786fa6');
  const [buttonTwo, setbuttonTwo] = useState('#fff');
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const handleLogout = useLogout();

  const getMessages = async () => {
    if (!chat) {
      console.error("Chat parameter is undefined or empty");
      return;
    }

    const dchat = decodeURIComponent(chat);
    

    try {
      const chatDoc = await getDoc(doc(db, "threads", dchat));
      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        
        if (chatData.messages && Array.isArray(chatData.messages)) {
          setMessages(prevMessages => [...prevMessages, ...chatData.messages]);
          console.log(messages);
        } else {
          console.log("No messages found in the document");
        }
      } else {
        console.log("No chat found with this id:", dchat);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };



  

  // Redirect section
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const styles = theme => ({
    multilineInput:
    {
      color:'#fff'
    }

  })

  useEffect(() => {
    document.title = "Learn Buddy";
    console.log("useEffect triggered. Chat:", chat);
    if (chat) {
      getMessages();
    } else {
      console.log("Chat is undefined in useEffect");
    }
  }, [chat]);

  useEffect(() => {
    console.log("Component mounted, starting auth check");
    const timeoutId = setTimeout(() => {
        if (isLoading) {
            console.log("Auth check timed out");
            setAuthError("Authentication check timed out");
            setIsLoading(false);
        }
    }, 1200000); // 20 min timeout

    const unsubscribe = auth.onAuthStateChanged((user) => {
        console.log("Auth state changed:", user ? "User logged in" : "User not logged in");
        if (user) {
            console.log("User authenticated, setting loading to false");
            setIsLoading(false);
        } else {
            console.log("User not authenticated, redirecting to signin");
            router.push('/signin');
        }
    }, (error) => {
        console.error("Auth error:", error);
        setAuthError(error.message);
        setIsLoading(false);
    });

    return () => {
        unsubscribe();
        clearTimeout(timeoutId);
    };
}, [router]);  



if (authError) {
  return (
      <Box
          bgcolor={col4}
          width={'100vw'}
          height={'100vh'}
          display="flex"
          justifyContent="center"
          alignItems="center"
      >
          <Typography variant="h4">Error: {authError}</Typography>
      </Box>
  );
}

  return (
    



    <Box
      backgroundColor={col1}
      width={'100vw'}
      height={'100vh'}
      overflow={'hidden'}
      boxSizing={'border-box'}
      
    >
      {/*/////////// Navbar starts //////////////*/}
      <Box
                        width='92vw'
                        height='8vh'
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                        padding={'0 4vw'}
                        >
                            <Typography
                            color={col4}
                            margin='0.5em'
                            fontSize='2em'
                            >
                                <Link
                                    color='inherit'
                                    underline='none'
                                    href='../'
                                >
                                    Learn Buddy
                                </Link>
                            </Typography>

                            <Box
                                display={'flex'}
                                justifyContent={'space-around'}
                                width={'30vw'}
                            >
                                <Button
                                    href='../dashboard/'
                                    
                                    sx={{color:col4,
                                        borderBottom:`4px solid ${col4}`,
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col4,
                                                    
                                        }

                                    }}
                                >
                                    <HomeIcon display={'block'} />
                                    
                                </Button>
                                <Button
                                    href='../editor/'
                                    sx={{color:col2,
                                        borderBottom:`4px solid ${col2}`,
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col2
                                        }

                                    }}
                                >
                                    <CodeIcon />
                                </Button>
                                <Button
                                    href='../chat/'
                                    sx={{color:col3,
                                        borderBottom:`4px solid ${col3}`,
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col3
                                        }

                                    }}
                                >
                                    <SupportAgentIcon />
                                </Button>
                                <Button
                                    href='../fcgen/'
                                    sx={{color:col5,
                                        borderBottom:`4px solid ${col5}`,
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col5
                                        }

                                    }}
                                >
                                    <BoltIcon />
                                </Button>
                            </Box>
                            
                            <Box>
                                {/* <Button
                                    href="./profile/"
                                    sx={{color:col4,
                                        
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col4
                                        }

                                    }}
                                >
                                    <Person4Icon/>
                                </Button> */}
                                <Button
                                    href="./profile/"
                                    onClick={handleLogout}
                                    sx={{color:col4,
                                        '&:hover':{
                                            color:col1,
                                            backgroundColor:col4
                                        }
                                    }}
                                >
                                    <LogoutIcon/>
                                </Button>
                            </Box>
                            
                        </Box>

                        {/*//////////////////////////// Navbar ends here /////////////////////////////////*/}
                        
      {/* ///////////////// Top pane ends here ////////////////// */}
      <Box
        height={'90vh'}
        padding={'1em'}
        margin={{xs:'0 0 10vh 0'}}
        width={{ xs: '90vw', sm: '80vw', md: '100vw' }}
      >
        <Stack
          direction={'column'}
          spacing={5}
          flexGrow={1}
          overflow={'auto'}
          maxHeight={'100%'}
          maxWidth={'100%'}
          disabled={isLoading}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display={'flex'}
              width={'95%'}
              marginBottom={{xs:'18vh'}}
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box color={col1} padding={'1em'} borderRadius={'2em'} bgcolor={
                message.role === 'assistant' ? col4 : col3
              }>
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
      </Box>
      
    </Box>

    
  );
}
