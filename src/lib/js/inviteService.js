import { auth, db } from "$lib/js/firebase";

import {
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    updateDoc,
    collection,
    serverTimestamp,
    query,
    where
} from "firebase/firestore";


/* =========================
   ENVIAR INVITACIÓN
========================= */

export async function sendInvite(email) {

    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const normalizedEmail = email.toLowerCase().trim();

    const userSnap = await getDoc(doc(db, "users", user.uid));
    const groupId = userSnap.data()?.currentGroupId;

    if (!groupId) throw new Error("User has no group");


    /* buscar uid del email */

    const emailSnap = await getDoc(
        doc(db, "emails", normalizedEmail)
    );

    if (!emailSnap.exists()) {
        throw new Error("User not found");
    }

    const invitedUid = emailSnap.data().uid;


    /* evitar invitación duplicada */

    const invitesSnap = await getDocs(
        collection(db, "users", invitedUid, "invites")
    );

    const alreadyInvited = invitesSnap.docs.find(
        d => d.data().groupId === groupId && d.data().status === "pending"
    );

    if (alreadyInvited) {
        throw new Error("User already invited");
    }


    /* obtener nombre del grupo */

    const groupSnap = await getDoc(
        doc(db, "groups", groupId)
    );

    const groupName = groupSnap.data()?.name ?? "Grupo";


    /* crear invitación */

    await addDoc(
        collection(db, "users", invitedUid, "invites"),
        {
            groupId,
            groupName,
            invitedBy: user.uid,
            invitedByEmail: user.email,
            status: "pending",
            createdAt: serverTimestamp()
        }
    );

}



/* =========================
   CARGAR INVITACIONES
========================= */

export async function loadInvites() {

    const user = auth.currentUser;
    if (!user) return [];

    const q = query(
        collection(db, "users", user.uid, "invites"),
        where("status", "==", "pending")
    );

    const snap = await getDocs(q);

    return snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

}



/* =========================
   ACEPTAR INVITACIÓN
========================= */

export async function acceptInvite(invite) {

    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");


    await setDoc(
        doc(db, "groups", invite.groupId, "members", user.uid),
        {
            name: user.displayName ?? "Usuario",
            email: user.email,
            photo: user.photoURL ?? null,
            role: "member",
            joinedAt: serverTimestamp()
        }
    );


    await updateDoc(
        doc(db, "users", user.uid),
        {
            currentGroupId: invite.groupId
        }
    );


    await updateDoc(
        doc(db, "users", user.uid, "invites", invite.id),
        {
            status: "accepted",
            acceptedAt: serverTimestamp()
        }
    );

}



/* =========================
   RECHAZAR INVITACIÓN
========================= */

export async function rejectInvite(invite) {

    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    await updateDoc(
        doc(db, "users", user.uid, "invites", invite.id),
        {
            status: "rejected",
            rejectedAt: serverTimestamp()
        }
    );

}