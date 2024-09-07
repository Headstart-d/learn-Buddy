'use client'

import { collection, writeBatch, doc, getDoc, setDoc, query,where, getDocs} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Container,Link, Typography, Card, Box,Grid, Paper, TextField, Button, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { useState} from "react";
import {auth, db} from '../../firebase';
import Head from 'next/head';
import { useEffect } from "react";
import useLogout from '../../components/logout';


import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BoltIcon from '@mui/icons-material/Bolt';
import Person4Icon from '@mui/icons-material/Person4';
import LogoutIcon from '@mui/icons-material/Logout';
import { CircularProgress } from "@mui/material";


const col6 = ['#3D405B'] // Dark shade
const col2 = ['#E07A5F'] //red
const col3 = ['#81B29A'] //green
const col4 = ['#F4F1DE'] //white
const col5 = ['#F2CC8F'] //yellow
const col1 = ['#191c35']; // Darker shade

export default function Generate({params}){
    const {card} = params;
    console.log(card);
    // Redirect section
    const router = useRouter(); 
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(null);
    const handleLogout = useLogout();

    
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    
    const [open, setOpen] = useState(false)
    
    const fetchFlashcards = async () => {
        const cardRef = collection(db, "cards");
        const querySnapshot = await getDocs(cardRef);
        const cardTitles = querySnapshot.docs.map((doc) => doc.id);
        console.log(cardTitles)
        const dcard = decodeURIComponent(card)
        console.log(dcard)
        try {
          const cardDoc = await getDoc(doc(db, "cards", dcard));
    
          if (cardDoc.exists()) {
            const cardData = cardDoc.data();
            console.log("Card data:", cardData);
            if (cardData.flashcards && Array.isArray(cardData.flashcards)) {
              setFlashcards(cardData.flashcards);
              setFlipped(new Array(cardData.flashcards.length).fill(false));
            } else {
              console.log("No flashcards found in the document.");
            }
          } else {
            console.log("No card found with this id.");
          }
        } catch (error) {
          console.error("Error fetching flashcards:", error);
        }
      };
    
    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))

    }

    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    
    useEffect(() => {
        if (card) {
          fetchFlashcards();
        }
      }, [card]);

    useEffect(() => {
        console.log("Component mounted, starting auth check");
        const timeoutId = setTimeout(() => {
            if (isLoading) {
                console.log("Auth check timed out");
                setAuthError("Authentication check timed out");
                setIsLoading(false);
            }
        }, 12000000); // 20 minute timeout

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

    if (isLoading) {
        return (
            <Box
                bgcolor={col1}
                width={'100vw'}
                height={'100vh'}
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <CircularProgress
                    height={'10'}
                    borderRadius={'10'}
                    color="success"
                ></CircularProgress>
            </Box>
        ); 
    }

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


        // Redirect section ends


    return(
        
        
            <Box
            width={'100vw'}
            minHeight={'100vh'}
            backgroundColor={col1}
            >
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
                                    href="../profile/"
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
            
            {
                flashcards.length>0 && (<Box sx={{mt:4}}>
                    <Typography
                        variant="h5"
                        color={col4}
                        textAlign={'center'}
                        fontWeight={'100'}
                    >
                        Flashcards Preview
                    </Typography>
                    <Box
                    width={'100vw'}
                    display={'flex'}
                    justifyContent={'center'}
                    >
                    <Box
                    width={'80vw'}>
                    <Grid container spacing={3}
                    
                    >
                        {flashcards.map((flashcard, index) =>
                            (  <Grid item xs={12} sm={6} md={4} key = {index}
                                
                                >
                                <Card
                                sx={{background:col1, borderRadius:'0.5em'}}
                                >
                                    <CardActionArea
                                        sx={{background:col4, borderRadius:'0.5em'}}
                                        onClick={() => {
                                            handleCardClick(index)
                                        }}
                                        backgroundColor={col1}
                                    >
                                        <CardContent
                                            sx={{background:col6, borderRadius:'0.5em'}}
                                        >
                                            <Box
                                                backgroundColor={col6}
                                                sx={{
                                                    fontWeight:'200',
                                                    perspective: '1000px',
                                                    '&>div': {
                                                        transition: 'transform 0.6s',
                                                        transformStyle: 'preserve-3d',
                                                        position: 'relative',
                                                        width:'100%',
                                                        height:'200px',
                                                        boxShadow: '0 4px 8px 0 rgba(0,0,0, 0.6)',
                                                        transform: flipped[index]
                                                        ? 'rotateY(180deg)'
                                                        : 'rotateY(0deg)',
                                                    },
                                                    '& > div > div': {
                                                        transition: 'transform 0.6s',
                                                        transformStyle: 'preserve-3d',
                                                        position: 'absolute',
                                                        width:'100%',
                                                        height:'100%',
                                                        backfaceVisibility: "hidden",
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        padding: 2,
                                                        boxSizing: 'border-box'
                                                    },
                                                    '& > div > div:nth-of-type(2)': {
                                                        transform: 'rotateY(180deg)'
                                                    },

                                                }}
                                            >
                                                <div>
                                                    <div
                                                        display={'flex'}
                                                    >
                                                        <Box
                                                            width={'20%'}
                                                            height={'100%'}
                                                            display={'flex'}
                                                            alignItems={'center'}
                                                        >
                                                            <Typography
                                                            color={col5}
                                                            variant="h5"
                                                            textAlign={'center'}
                                                            display={'block'}
                                                            fontWeight={'800'}
                                                            >
                                                                <BoltIcon />
                                                            </Typography>
                                                        </Box>
                                                        <Box
                                                            width={'80%'}
                                                            height={'100%'}
                                                            display={'flex'}
                                                            alignItems={'center'}
                                                        >
                                                        <Typography
                                                            variant="h5"
                                                            component="div"
                                                            color={col4}
                                                        >
                                                            
                                                            {flashcard.front}
                                                        </Typography>
                                                        </Box>
                                                        
                                                    </div>
                                                    <div>
                                                        <Typography
                                                            variant="h5"
                                                            fontWeight={'100'}
                                                            fontSize={'1.2em'}
                                                            textAlign={'center'}
                                                            component="div"
                                                            color={col4}
                                                        >
                                                            {flashcard.back}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                            
                            )
                        )}
                    </Grid>
                    </Box>
                    </Box>
                    
                </Box>
            )}
            </Box>
        

    )
}