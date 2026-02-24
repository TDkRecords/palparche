import { auth, db } from "$lib/js/firebase";

import {
    doc,
    addDoc,
    getDocs,
    collection,
    serverTimestamp,
    updateDoc
} from "firebase/firestore";

export async function sendInvite(email) {
    const user = auth.currentUser;
    if (!user) return;

    const userSnap = await getDoc(doc(db, "users", user.uid));
    const groupId = userSnap.data()?.currentGroupId;

    if (!groupId) throw new Error("No group");

    await addDoc(
        collection(db, "groups", groupId, "invites"),
        {
            email,
            invitedBy: user.uid,
            status: "pending",
            createdAt: serverTimestamp()
        }
    );
}

export async function loadInvites() {
    const user = auth.currentUser;
    if (!user) return [];

    const groupsSnap = await getDocs(collection(db, "groups"));

    let invites = [];

    for (const group of groupsSnap.docs) {
        const invitesSnap = await getDocs(
            collection(db, "groups", group.id, "invites")
        );

        invitesSnap.forEach(invite => {
            const data = invite.data();

            if (
                data.email?.toLowerCase() ===
                user.email?.toLowerCase() &&
                data.status === "pending"
            ) {
                invites.push({
                    id: invite.id,
                    groupId: group.id,
                    ...data
                });
            }
        });
    }

    return invites;
}

export async function acceptInvite(invite) {
    const user = auth.currentUser;

    await setDoc(
        doc(db, "groups", invite.groupId, "members", user.uid),
        {
            role: "member",
            joinedAt: serverTimestamp()
        }
    );

    await updateDoc(doc(db, "users", user.uid), {
        currentGroupId: invite.groupId
    });

    await updateDoc(
        doc(db, "groups", invite.groupId, "invites", invite.id),
        { status: "accepted" }
    );
}

export async function rejectInvite(invite) {
    await updateDoc(
        doc(db, "groups", invite.groupId, "invites", invite.id),
        { status: "rejected" }
    );
}