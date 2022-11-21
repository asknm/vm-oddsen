import React from 'react';
import { collection, CollectionReference, getFirestore, onSnapshot, orderBy, query } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { UserWithBalance } from "common";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

export default function TopList() {
    const [users, setUsers] = useState<UserWithBalance[]>([]);

    useEffect(() => {
        const q = query(collection(getFirestore(), "users") as CollectionReference<UserWithBalance>, orderBy("balance", "desc"));
        onSnapshot(q, snapshot => {
            const res = snapshot.docs.map<UserWithBalance>(doc => {
                const data = doc.data();
                const user: UserWithBalance = {
                    name: data.name,
                    balance: Math.round(data.balance * 20) / 20,
                }
                return user;
            });
            setUsers(res);
        });
    }, []);


    return <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell> # </TableCell>
                    <TableCell> Navn </TableCell>
                    <TableCell> Balanse </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {users.map((value, index) => (
                    <TableRow key={index}>
                        <TableCell> {index + 1} </TableCell>
                        <TableCell> {value.name} </TableCell>
                        <TableCell> {value.balance}kr </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>

}