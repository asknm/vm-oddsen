import React from 'react';
import { getAuth } from '@firebase/auth';
import AppBar from '@mui/material/AppBar/AppBar';
import Button from '@mui/material/Button/Button';
import Toolbar from '@mui/material/Toolbar/Toolbar';
import { styled } from '@mui/system';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import MatchPage from './Pages/MatchPage';
import TopList from './Pages/TopList';

export default function Home() {

    const StyledLink = styled(Link)({
        flexGrow: 1,
        color: "white",
    })

    return <BrowserRouter>
        <AppBar position="static">
            <Toolbar>
                <StyledLink to="/">
                    Hjem
                </StyledLink>
                <StyledLink to="/top">
                    Topplisten
                </StyledLink>
                <Button color="secondary" onClick={() => getAuth().signOut()} >
                    Logg ut
                </Button>
            </Toolbar>
        </AppBar>

        <Routes>
            <Route path='/m/:mid' element={<MatchPage />} />
            <Route path="/top" element={<TopList />} />
            <Route path="/" element={<Dashboard />} />
        </Routes>
    </BrowserRouter>
}