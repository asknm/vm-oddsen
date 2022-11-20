import React from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Button from '@mui/material/Button';

export default function Login() {

    async function login() {
        await signInWithPopup(getAuth(), new GoogleAuthProvider());
    }

    return <Button variant="contained" onClick={login}>
        Log in
    </Button>
}