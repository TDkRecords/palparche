import { auth, db } from "$lib/js/firebase";

import {
    doc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    collection,
    serverTimestamp,
    updateDoc
} from "firebase/firestore";


export async function loadGroup() {

    const user = auth.currentUser;
    if (!user) return null;

    const userSnap = await getDoc(doc(db, "users", user.uid));
    const groupId = userSnap.data()?.currentGroupId;

    if (!groupId) return null;

    const groupSnap = await getDoc(
        doc(db, "groups", groupId)
    );

    const membersSnap = await getDocs(
        collection(db, "groups", groupId, "members")
    );

    const members = membersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    return {
        groupId,
        group: groupSnap.data(),
        members
    };

}



export async function createGroup(name) {

    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const groupRef = doc(collection(db, "groups"));

    await setDoc(groupRef, {
        name,
        ownerId: user.uid,
        createdAt: serverTimestamp()
    });


    await setDoc(
        doc(db, "groups", groupRef.id, "members", user.uid),
        {
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            role: "owner",
            joinedAt: serverTimestamp()
        }
    );


    await updateDoc(
        doc(db, "users", user.uid),
        {
            currentGroupId: groupRef.id
        }
    );

    return groupRef.id;

}



export async function updateGroupName(groupId, name) {

    const user = auth.currentUser;

    const groupSnap = await getDoc(
        doc(db, "groups", groupId)
    );

    if (groupSnap.data().ownerId !== user.uid) {
        throw new Error("Only owner can update");
    }

    await updateDoc(
        doc(db, "groups", groupId),
        { name }
    );

}



export async function removeMember(groupId, memberId) {

    const user = auth.currentUser;

    const groupSnap = await getDoc(
        doc(db, "groups", groupId)
    );

    if (groupSnap.data().ownerId !== user.uid) {
        throw new Error("Only owner can remove");
    }


    await deleteDoc(
        doc(db, "groups", groupId, "members", memberId)
    );


    await updateDoc(
        doc(db, "users", memberId),
        {
            currentGroupId: null
        }
    );

}



export async function deleteGroup(groupId) {

    const user = auth.currentUser;

    const groupSnap = await getDoc(
        doc(db, "groups", groupId)
    );

    if (groupSnap.data().ownerId !== user.uid) {
        throw new Error("Only owner can delete");
    }


    const membersSnap = await getDocs(
        collection(db, "groups", groupId, "members")
    );


    for (const member of membersSnap.docs) {

        await updateDoc(
            doc(db, "users", member.id),
            {
                currentGroupId: null
            }
        );

        await deleteDoc(member.ref);

    }


    await deleteDoc(
        doc(db, "groups", groupId)
    );

}