<script>
    import { auth } from "$lib/js/firebase";
    import { onAuthStateChanged } from "firebase/auth";
    import { onMount } from "svelte";

    import {
        loadGroup,
        createGroup as createGroupService,
        updateGroupName as updateGroupNameService,
        removeMember as removeMemberService,
        deleteGroup as deleteGroupService,
    } from "$lib/js/groupService";

    import {
        sendInvite as sendInviteService,
        loadInvites as loadInvitesService,
        acceptInvite as acceptInviteService,
        rejectInvite as rejectInviteService,
    } from "$lib/js/inviteService";

    import InviteBanner from "./components/InviteBanner.svelte";
    import GroupForm from "./components/GroupForm.svelte";
    import MembersList from "./components/MembersList.svelte";
    import SendInvite from "./components/SendInvite.svelte";

    let loading = false;

    let groupName = "";
    let currentGroupId = null;
    let groupData = null;
    let isOwner = false;

    let members = [];

    let invites = [];
    let inviteEmail = "";

    let invitesLoaded = false;

    async function loadGroupData() {
        console.log("🔄 Cargando datos del grupo...");
        const data = await loadGroup();

        if (!data) {
            console.log("⚠️ No hay grupo para este usuario");
            currentGroupId = null;
            groupData = null;
            members = [];
            isOwner = false;
            return;
        }

        currentGroupId = data.groupId;
        groupData = data.group;
        members = data.members;

        const user = auth.currentUser;
        isOwner = groupData?.ownerId === user?.uid;

        console.log("✅ Datos del grupo cargados:", {
            groupId: currentGroupId,
            name: groupData?.name,
            isOwner,
            members: members.length,
        });
    }

    async function forceLoadInvites() {
        console.log("🔄 FORZANDO carga de invitaciones...");
        invitesLoaded = false;

        try {
            const result = await loadInvitesService();
            invites = result;
            invitesLoaded = true;

            console.log("📬 Invitaciones cargadas:", invites);

            if (invites.length > 0) {
                console.log("🎉 ¡HAY INVITACIONES PENDIENTES!", invites);
            } else {
                console.log("📭 No hay invitaciones pendientes");
            }
        } catch (error) {
            console.error("❌ Error cargando invitaciones:", error);
            invites = [];
        }
    }

    async function createGroup() {
        if (!groupName.trim()) {
            alert("Por favor ingresa un nombre para el grupo");
            return;
        }

        loading = true;

        try {
            await createGroupService(groupName);
            groupName = "";
            await loadGroupData();
            alert("Grupo creado 🚀");
        } catch (error) {
            console.error(error);
            alert("Error al crear grupo");
        } finally {
            loading = false;
        }
    }

    async function updateGroupName() {
        if (!currentGroupId) return;

        try {
            await updateGroupNameService(currentGroupId, groupData.name);
            alert("Nombre actualizado");
        } catch (error) {
            console.error(error);
            alert("Error al actualizar nombre");
        }
    }

    async function removeMember(memberId) {
        if (!currentGroupId) return;

        if (!confirm("¿Eliminar este miembro del grupo?")) return;

        try {
            await removeMemberService(currentGroupId, memberId);
            await loadGroupData();
            alert("Miembro eliminado");
        } catch (error) {
            console.error(error);
            alert("Error al eliminar miembro");
        }
    }

    async function deleteGroup() {
        if (!confirm("¿Eliminar grupo? Esta acción no se puede deshacer."))
            return;

        try {
            await deleteGroupService(currentGroupId);
            currentGroupId = null;
            groupData = null;
            members = [];
            alert("Grupo eliminado");
        } catch (error) {
            console.error(error);
            alert("Error al eliminar grupo");
        }
    }

    async function sendInvite() {
        if (!inviteEmail.trim()) {
            alert("Por favor ingresa un email");
            return;
        }

        if (!currentGroupId) {
            alert("Debes estar en un grupo para enviar invitaciones");
            return;
        }

        loading = true;

        try {
            await sendInviteService(inviteEmail);
            inviteEmail = "";
            alert("Invitación enviada 📩");
        } catch (error) {
            console.error(error);
            alert("Error al enviar invitación: " + error.message);
        } finally {
            loading = false;
        }
    }

    async function acceptInvite(invite) {
        try {
            await acceptInviteService(invite);
            await loadGroupData();
            await forceLoadInvites();
            alert("Te has unido al grupo 🎉");
        } catch (error) {
            console.error(error);
            alert("Error al aceptar invitación");
        }
    }

    async function rejectInvite(invite) {
        try {
            await rejectInviteService(invite);
            await forceLoadInvites();
            alert("Invitación rechazada");
        } catch (error) {
            console.error(error);
            alert("Error al rechazar invitación");
        }
    }

    onMount(() => {
        console.log("🚀 Componente montado");

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                console.log("❌ No hay usuario autenticado");
                return;
            }

            console.log("✅ Usuario autenticado:", user.email);

            await loadGroupData();

            setTimeout(async () => {
                await forceLoadInvites();
            }, 500);
        });

        return unsubscribe;
    });
</script>

<div class="flex flex-col min-h-screen bg-gray-50">
    <!-- HEADER CON DEGRADADO -->
    <header
        class="bg-linear-to-r from-emerald-600 to-green-600 text-white px-4 sm:px-6 py-6 shadow-md"
    >
        <h1 class="text-2xl sm:text-3xl font-bold">Grupos</h1>
        <p class="text-white/80 mt-1 text-sm sm:text-base">
            Administra tu grupo e invitaciones
        </p>
    </header>

    <main class="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
        <InviteBanner
            {invites}
            {invitesLoaded}
            onAcceptInvite={acceptInvite}
            onRejectInvite={rejectInvite}
        />

        <GroupForm
            {currentGroupId}
            {groupData}
            {isOwner}
            {loading}
            bind:groupName
            onCreateGroup={createGroup}
            onUpdateGroupName={updateGroupName}
            onDeleteGroup={deleteGroup}
        >
            <svelte:fragment slot="members">
                <MembersList
                    {members}
                    {isOwner}
                    onRemoveMember={removeMember}
                />
            </svelte:fragment>

            <svelte:fragment slot="invite">
                <SendInvite
                    bind:inviteEmail
                    {loading}
                    onSendInvite={sendInvite}
                />
            </svelte:fragment>
        </GroupForm>
    </main>
</div>
