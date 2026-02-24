import { auth, db } from "$lib/js/firebase";

import {
    doc,
    getDoc,
    setDoc,
    addDoc,
    getDocs,
    collection,
    serverTimestamp,
    updateDoc,
    query,
    where
} from "firebase/firestore";

export async function sendInvite(email) {
    const user = auth.currentUser;
    if (!user) {
        console.error("❌ No hay usuario autenticado");
        return;
    }

    console.log("📤 Enviando invitación a:", email);
    console.log("👤 Usuario actual:", user.email);

    const userSnap = await getDoc(doc(db, "users", user.uid));
    const userData = userSnap.data();

    console.log("📄 Datos del usuario:", userData);

    const groupId = userData?.currentGroupId;

    if (!groupId) {
        console.error("❌ Usuario no tiene grupo");
        throw new Error("No group");
    }

    console.log("🏢 ID del grupo:", groupId);

    const inviteData = {
        email: email.toLowerCase().trim(), // ✅ Normalizar email
        invitedBy: user.uid,
        invitedByEmail: user.email, // ✅ Guardar email de quien invita
        status: "pending",
        createdAt: serverTimestamp()
    };

    console.log("💾 Guardando invitación:", inviteData);

    const inviteRef = await addDoc(
        collection(db, "groups", groupId, "invites"),
        inviteData
    );

    console.log("✅ Invitación guardada con ID:", inviteRef.id);
}

export async function loadInvites() {
    const user = auth.currentUser;
    if (!user) {
        console.log("❌ No hay usuario para cargar invitaciones");
        return [];
    }

    console.log("🔍 Buscando invitaciones para:", user.email);

    const userEmail = user.email.toLowerCase().trim();

    try {
        const groupsSnap = await getDocs(collection(db, "groups"));
        console.log("📊 Total de grupos encontrados:", groupsSnap.docs.length);

        let invites = [];

        for (const groupDoc of groupsSnap.docs) {
            const groupId = groupDoc.id;
            const groupData = groupDoc.data();

            console.log(`🔍 Revisando grupo: ${groupId} (${groupData.name || 'Sin nombre'})`);

            const invitesQuery = query(
                collection(db, "groups", groupId, "invites"),
                where("email", "==", userEmail),
                where("status", "==", "pending")
            );

            const invitesSnap = await getDocs(invitesQuery);

            console.log(`  📧 Invitaciones en este grupo: ${invitesSnap.docs.length}`);

            invitesSnap.forEach(inviteDoc => {
                const data = inviteDoc.data();

                console.log(`    📩 Invitación:`, {
                    id: inviteDoc.id,
                    email: data.email,
                    status: data.status,
                    invitedBy: data.invitedByEmail || data.invitedBy
                });

                const inviteEmail = data.email?.toLowerCase().trim();

                if (inviteEmail === userEmail && data.status === "pending") {
                    console.log("    ✅ MATCH! Esta invitación es para el usuario actual");

                    invites.push({
                        id: inviteDoc.id,
                        groupId: groupId,
                        groupName: groupData.name || "Grupo sin nombre",
                        ...data
                    });
                } else {
                    console.log(`    ⏭️  No match: email=${inviteEmail} vs ${userEmail}, status=${data.status}`);
                }
            });
        }

        console.log("📬 Total de invitaciones pendientes:", invites.length);
        console.log("📋 Invitaciones:", invites);

        return invites;
    } catch (error) {
        console.error("❌ Error cargando invitaciones:", error);
        return [];
    }
}

export async function acceptInvite(invite) {
    const user = auth.currentUser;

    console.log("✅ Aceptando invitación:", invite);

    try {
        // 1. Agregar usuario como miembro del grupo
        await setDoc(
            doc(db, "groups", invite.groupId, "members", user.uid),
            {
                role: "member",
                joinedAt: serverTimestamp()
            }
        );
        console.log("✅ Usuario agregado como miembro");

        // 2. Actualizar currentGroupId del usuario
        await updateDoc(doc(db, "users", user.uid), {
            currentGroupId: invite.groupId
        });
        console.log("✅ currentGroupId actualizado");

        // 3. Marcar invitación como aceptada
        await updateDoc(
            doc(db, "groups", invite.groupId, "invites", invite.id),
            {
                status: "accepted",
                acceptedAt: serverTimestamp()
            }
        );
        console.log("✅ Invitación marcada como aceptada");

    } catch (error) {
        console.error("❌ Error aceptando invitación:", error);
        throw error;
    }
}

export async function rejectInvite(invite) {
    console.log("❌ Rechazando invitación:", invite);

    try {
        await updateDoc(
            doc(db, "groups", invite.groupId, "invites", invite.id),
            {
                status: "rejected",
                rejectedAt: serverTimestamp()
            }
        );
        console.log("✅ Invitación rechazada");
    } catch (error) {
        console.error("❌ Error rechazando invitación:", error);
        throw error;
    }
}