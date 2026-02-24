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
    const groupId = userSnap.data()?.currentGroupId ?? null;

    if (!groupId) return null;

    const groupSnap = await getDoc(doc(db, "groups", groupId));

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
    if (!user) return;

    const groupRef = doc(collection(db, "groups"));

    await setDoc(groupRef, {
        name,
        ownerId: user.uid,
        createdAt: serverTimestamp()
    });

    await setDoc(
        doc(db, "groups", groupRef.id, "members", user.uid),
        {
            role: "owner",
            joinedAt: serverTimestamp()
        }
    );

    await updateDoc(doc(db, "users", user.uid), {
        currentGroupId: groupRef.id
    });

    return groupRef.id;
}

export async function updateGroupName(groupId, name) {
    await updateDoc(doc(db, "groups", groupId), { name });
}

export async function removeMember(groupId, memberId) {
    await deleteDoc(doc(db, "groups", groupId, "members", memberId));

    await updateDoc(doc(db, "users", memberId), {
        currentGroupId: null
    });
}

export async function deleteGroup(groupId) {
    const user = auth.currentUser;

    await deleteDoc(doc(db, "groups", groupId));

    await updateDoc(doc(db, "users", user.uid), {
        currentGroupId: null
    });
}