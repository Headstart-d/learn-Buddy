'use client'

import { 
  Box, Link, Typography, Button, Grid, 
  IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText,
  CircularProgress, Divider, Stack 
} from '@mui/material';
import questions from '../editor/questions.json';
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BoltIcon from '@mui/icons-material/Bolt';
import Person4Icon from '@mui/icons-material/Person4';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add'; 

import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useLogout from '../components/logout';

import MoodIcon from '@mui/icons-material/Mood';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import MoodBadIcon from '@mui/icons-material/MoodBad';

const col6 = '#3D405B';
const col2 = '#E07A5F';
const col3 = '#81B29A';
const col4 = '#F4F1DE';
const col5 = '#F2CC8F';
const col1 = '#191c35';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [name, setName] = useState('');
  const [chats, setChats] = useState([]);
  const [cards, setCards] = useState([]);
  const handleLogout = useLogout();
  const [yourScore, setYourScore] = useState('');
  const [highestScore, setHighestScore] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const getMaxScore = async () => {
    try {
      const userRef = collection(db, "users");
      const querySnapshot = await getDocs(userRef);
      if (!querySnapshot.empty) {
        let maxScore = 0;
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          const userScore = userData.score;
          if (userScore > maxScore) {
            maxScore = userScore;
          }
        });
        setHighestScore(maxScore);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getNameByEmail = async (email) => {
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        setName(userData.name);
        setYourScore(userData.score);
      } else {
        console.log("No user found with this email.");
        setAuthError("User data not found.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setAuthError(error.message);
    }
  };

  const getChats = async () => {
    const chatRef = collection(db, "threads");
    const querySnapshot = await getDocs(chatRef);
    const docTitles = querySnapshot.docs.map((doc) => doc.id);
    setChats(docTitles);
  };

  const getCards = async () => {
    const cardsRef = collection(db, "cards");
    const qSnap = await getDocs(cardsRef);
    const cardTitles = qSnap.docs.map((doc) => doc.id);
    setCards(cardTitles);
  };

  useEffect(() => {
    getMaxScore();
    getCards();
    getChats();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoading(false);
        getNameByEmail(user.email);
      } else {
        router.push('/signin');
      }
    }, (error) => {
      setAuthError(error.message);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <Box
        bgcolor={col4}
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress height="10" borderRadius="10" color="success" />
      </Box>
    );
  }

  if (authError) {
    return (
      <Box
        bgcolor={col4}
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h4">Error: {authError}</Typography>
      </Box>
    );
  }

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box bgcolor={col1} sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
      <Grid container spacing={2} sx={{ padding: '2vw' }}>
        {/* Header */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography color={col4} variant="h4" component={Link} href="./" underline="none">
              Learn Buddy
            </Typography>
            <IconButton onClick={toggleDrawer} sx={{ color: col4, display: { sm: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
              {[
                { href: './dashboard/', icon: <HomeIcon />, color: col4 },
                { href: './editor/', icon: <CodeIcon />, color: col2 },
                { href: './chat/', icon: <SupportAgentIcon />, color: col3 },
                { href: './fcgen/', icon: <BoltIcon />, color: col5 },
              ].map((item, index) => (
                <Button key={index} href={item.href} sx={{ color: item.color, borderBottom: `4px solid ${item.color}`, '&:hover': { color: col1, backgroundColor: item.color } }}>
                  {item.icon}
                </Button>
              ))}
              <Button href="./profile/" sx={{ color: col4, '&:hover': { color: col1, backgroundColor: col4 } }}>
                <Person4Icon />
              </Button>
              <Button onClick={handleLogout} sx={{ color: col4, '&:hover': { color: col1, backgroundColor: col4 } }}>
                <LogoutIcon />
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Welcome Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Box height="35vh" bgcolor={col4} borderRadius="0.5em" padding="2em" display="flex" flexDirection="column" justifyContent="space-between">
            <Typography variant="h3" color={col1}>Welcome, {name}!</Typography>
            <Box sx={{ bgcolor: col2, p: 2, borderRadius: '10px' }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <StarIcon sx={{ color: col4 }} />
                            <Typography variant="h6" sx={{ color: col4 }}>
                                Core Score: {yourScore}
                            </Typography>
                        </Stack>
                    </Box>

                    <Box sx={{ bgcolor: col2, p: 2, borderRadius: '10px' }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <EmojiEventsIcon sx={{ color: col4 }} />
                            <Typography variant="h6" sx={{ color: col4 }}>
                                High Score: {highestScore}
                            </Typography>
                        </Stack>
                    </Box>
          </Box>
        </Grid>

        {/* Discussion Threads */}
        <Grid item xs={12} md={9}>
          <Box height="45vh" bgcolor={col6} borderRadius="0.5em" overflow="hidden">
            <Box height="8vh" borderBottom={`1px solid ${col1}`} display="flex" alignItems="center" justifyContent="space-between" px={2}>
              <Typography color={col4}><SupportAgentIcon /> Discussion Threads</Typography>
              <IconButton onClick={() => router.push('/chat')} sx={{ color: col4 }}>
                <AddIcon />
              </IconButton>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1} p={1} sx={{overflowY: 'auto' }}>
              {chats.map(chat => (
                <Link key={chat} href={`./chats/${chat}`} underline="none">
                  <Typography color={col4} bgcolor={col1} padding="0.5em 1em" borderRadius={2} sx={{ '&:hover': { bgcolor: col4, color: col1 } }}>
                    {chat}
                  </Typography>
                </Link>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* DSA Problems */}
        <Grid item xs={12} md={6}>
          <Box height="50vh" bgcolor={col6} borderRadius="0.5em" overflow="hidden">
            <Box height="12vh" borderBottom={`1px solid ${col1}`} display="flex" alignItems="center" justifyContent="center">
              <Typography color={col4}><CodeIcon /> DSA problems</Typography>
            </Box>
            <Box height="35vh" overflow="auto">
              {questions.questions.map(question => (
                <Link key={question.id} href={`./editor/${question.id}`} underline="none">
                  <Box color={col4} height="5vh" borderBottom={`1px solid ${col1}`} display="flex" alignItems="center" justifyContent="space-between" sx={{'&:hover':{ bgcolor:col4, color:col1 }}} px={2}>
                    <Typography>{question.shortTitle}</Typography>
                    <DifficultyIcon difficulty={question.difficulty} col2={col2} col3={col3} col5={col5} />
                  </Box>
                </Link>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Flashcards */}
        <Grid item xs={12} md={6}>
          <Box height="50vh" bgcolor={col6} borderRadius="0.5em" overflow="hidden">
            <Box height="8vh" borderBottom={`1px solid ${col1}`} display="flex" alignItems="center" justifyContent="space-between" px={2}>
              <Typography color={col4}><BoltIcon /> Flashcards</Typography>
              <IconButton onClick={() => router.push('/fcgen')} sx={{ color: col4 }}>
                <AddIcon />
              </IconButton>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1} p={1} sx={{ height: 'calc(100% - 8vh)', overflowY: 'auto' }}>
              {cards.map(card => (
                <Link key={card} href={`./flashcards/${card}`} underline="none">
                  <Typography color={col4} bgcolor={col1} width="5em" height="6em" padding="1em" borderRadius={2} textAlign="center" display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ '&:hover': { bgcolor: col4, color: col1 } }}>
                    <BoltIcon sx={{ color: col5, marginBottom: '0.5em' }} />
                    {card}
                  </Typography>
                </Link>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Drawer for mobile */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer} sx={{ '& .MuiDrawer-paper': { bgcolor: col1, color: col4 } }}>
        <List>
          {[
            { text: 'Dashboard', icon: <HomeIcon />, href: './dashboard/' },
            { text: 'Editor', icon: <CodeIcon />, href: './editor/' },
            { text: 'Chat', icon: <SupportAgentIcon />, href: './chat/' },
            { text: 'Flashcards', icon: <BoltIcon />, href: './fcgen/' },
          ].map((item, index) => (
            <ListItem button key={item.text} onClick={() => { router.push(item.href); toggleDrawer(); }}>
              <ListItemIcon sx={{ color: col4 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          <Divider />
          <ListItem button onClick={() => { router.push('./profile/'); toggleDrawer(); }}>
            <ListItemIcon sx={{ color: col4 }}><Person4Icon /></ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon sx={{ color: col4 }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

const ScoreDisplay = ({ label, score, bgcolor }) => (
  <Typography textAlign="center" fontSize="0.7em">
    {label}
    <Typography variant="span" padding="0.2em 0.8em" bgcolor={bgcolor} color={col4} fontSize="2.7em" borderRadius="0.5em" display="block" mt={1}>
      {score}
    </Typography>
  </Typography>
);

const DifficultyIcon = ({ difficulty, col2, col3, col5 }) => {
  const iconProps = {
    easy: { icon: <MoodIcon />, color: col3 },
    medium: { icon: <SentimentSatisfiedIcon />, color: col5 },
    hard: { icon: <MoodBadIcon />, color: col2 },
  }[difficulty] || {};

  return <Typography color={iconProps.color}>{iconProps.icon}</Typography>;
};