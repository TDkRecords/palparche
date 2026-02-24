<script>
    import Buttons from "$lib/Components/Buttons.svelte";
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

    let sidebarOpen = true;

    let groupPanelOpen = false;
    let invitePanelOpen = false;

    let loading = false;

    let groupName = "";
    let currentGroupId = null;
    let groupData = null;
    let isOwner = false;

    let members = [];

    let invites = [];
    let inviteEmail = "";

    async function loadGroupData() {
        const data = await loadGroup();

        if (!data) {
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
    }

    async function createGroup() {
        if (!groupName.trim()) return;

        loading = true;

        try {
            const groupId = await createGroupService(groupName);

            groupName = "";

            await loadGroupData();

            groupPanelOpen = true;

            alert("Grupo creado 🚀");
        } catch (error) {
            console.error(error);
            alert("Error al crear grupo");
        }

        loading = false;
    }

    async function updateGroupName() {
        if (!currentGroupId) return;

        await updateGroupNameService(currentGroupId, groupData.name);

        alert("Nombre actualizado");
    }

    async function removeMember(memberId) {
        if (!currentGroupId) return;

        await removeMemberService(currentGroupId, memberId);

        await loadGroupData();
    }

    async function deleteGroup() {
        if (!confirm("Eliminar grupo?")) return;

        await deleteGroupService(currentGroupId);

        currentGroupId = null;
        groupData = null;
        members = [];

        alert("Grupo eliminado");
    }

    async function openGroupPanel() {
        await loadGroupData();
        groupPanelOpen = true;
    }

    async function sendInvite() {
        if (!inviteEmail.trim()) return;

        loading = true;

        try {
            await sendInviteService(inviteEmail);

            inviteEmail = "";
            invitePanelOpen = false;

            alert("Invitación enviada 📩");
        } catch (error) {
            console.error(error);
            alert("Error al enviar invitación");
        }

        loading = false;
    }

    async function loadInvites() {
        invites = await loadInvitesService();
    }

    async function acceptInvite(invite) {
        await acceptInviteService(invite);

        await loadGroupData();
        await loadInvites();
    }

    async function rejectInvite(invite) {
        await rejectInviteService(invite);

        await loadInvites();
    }

    onMount(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) return;

            await loadGroupData();
            await loadInvites();
        });

        return unsubscribe;
    });
</script>

<!-- Layout principal -->
<div class="flex flex-col min-h-screen bg-gray-50">
    <!-- HEADER -->
    <header
        class="h-16 flex justify-between items-center px-6 py-4 bg-linear-to-r from-emerald-600 to-green-600 text-white shadow-md"
    >
        <img
            src="/images/logo-white.webp"
            alt="Logo Pal Parche"
            class="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain"
        />

        <div class="flex gap-6 lg:text-xl md:text-lg sm:text-sm">
            <button
                on:click={openGroupPanel}
                class="hover:opacity-80 cursor-pointer transition"
            >
                <!-- grupos -->
                <i class="fa-solid fa-users"></i>
            </button>

            <!-- Invitar personas -->
            <button
                on:click={() => (invitePanelOpen = true)}
                class="hover:opacity-80 cursor-pointer transition"
            >
                <!-- invitar personas -->
                <i class="fa-solid fa-arrow-up-from-bracket"></i>
            </button>
            <!-- <i
                class="fa-solid fa-gear hover:opacity-80 cursor-pointer transition"
            ></i> -->
        </div>
    </header>

    <!-- BODY -->
    <div class="flex flex-1">
        <!-- SIDEBAR (Desktop) -->
        <aside
            class={`hidden sm:flex sm:flex-col
            bg-linear-to-b from-emerald-600 to-green-600
            text-white shadow-lg
            transition-all duration-300 ease-in-out
            ${sidebarOpen ? "w-48 p-6" : "w-20 p-4"}`}
        >
            <div class="flex justify-end">
                <button
                    on:click={() => (sidebarOpen = !sidebarOpen)}
                    class="hidden sm:flex items-center justify-center text-white hover:opacity-80 cursor-pointer
           w-100 h-10 rounded-lg border-b border-white/20
           hover:bg-white/10 transition"
                >
                    <!-- menu -->
                    <i
                        class={`fa-solid ${sidebarOpen ? "fa-angles-left" : "fa-angles-right"}`}
                    ></i>
                </button>
            </div>
            <nav class="flex flex-col gap-4 mt-6">
                <a
                    href="/home"
                    class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition"
                >
                    <i class="fa-solid fa-house text-lg"></i>
                    {#if sidebarOpen}
                        <span class="font-medium">Home</span>
                    {/if}
                </a>

                <a
                    href="/home/income"
                    class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition"
                >
                    <i class="fa-solid fa-money-bill-trend-up text-lg"></i>
                    {#if sidebarOpen}
                        <span class="font-medium">Ingresos</span>
                    {/if}
                </a>

                <a
                    href="/home/expense"
                    class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition"
                >
                    <i class="fa-solid fa-receipt text-lg"></i>
                    {#if sidebarOpen}
                        <span class="font-medium">Egresos</span>
                    {/if}
                </a>

                <a
                    href="/home/profile"
                    class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition"
                >
                    <i class="fa-solid fa-user text-lg"></i>
                    {#if sidebarOpen}
                        <span class="font-medium">Perfil</span>
                    {/if}
                </a>
            </nav>
        </aside>

        <!-- MAIN -->
        <div>
            {#if invites.length > 0}
                <div class="mb-6 space-y-3">
                    <h2 class="font-semibold text-gray-700">
                        Invitaciones pendientes
                    </h2>

                    {#each invites as invite}
                        <div
                            class="p-4 bg-white border rounded-xl flex justify-between items-center"
                        >
                            <span class="text-sm">
                                Te invitaron a un grupo
                            </span>

                            <div class="flex gap-2">
                                <button
                                    on:click={() => acceptInvite(invite)}
                                    class="px-3 py-1 bg-emerald-500 text-white rounded-lg"
                                >
                                    Aceptar
                                </button>

                                <button
                                    on:click={() => rejectInvite(invite)}
                                    class="px-3 py-1 bg-gray-200 rounded-lg"
                                >
                                    Rechazar
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}

            <main class="flex-1 px-4 py-2 pb-24 sm:pb-6">
                <slot />
            </main>
        </div>
    </div>
    <div>
        {#if groupPanelOpen}
            <div class="fixed inset-0 z-50 flex justify-end">
                <!-- Overlay -->
                <div
                    class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
                    on:click={() => (groupPanelOpen = false)}
                    role="presentation"
                ></div>

                <!-- Panel -->
                <div
                    class="relative w-full sm:w-105 h-full
        bg-white
        shadow-2xl
        border-l border-emerald-100
        animate-slideIn
        flex flex-col"
                >
                    <!-- Header -->
                    <div
                        class="bg-linear-to-r from-emerald-600 to-green-600
            text-white p-6
            flex justify-between items-center"
                    >
                        <h2 class="text-lg font-semibold tracking-wide">
                            {#if !currentGroupId}
                                Crear Grupo
                            {:else}
                                Administrar Grupo
                            {/if}
                        </h2>

                        <button
                            on:click={() => (groupPanelOpen = false)}
                            class="hover:opacity-80 transition"
                            aria-label="Cerrar panel"
                        >
                            <i class="fa-solid fa-xmark text-xl"></i>
                        </button>
                    </div>

                    <!-- BODY -->
                    <div
                        class="flex-1 p-6 space-y-8 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-200"
                    >
                        {#if !currentGroupId}
                            <!-- CREAR GRUPO -->

                            <div class="space-y-2">
                                <label
                                    class="text-sm font-medium text-gray-600"
                                    for="groupName"
                                >
                                    Nombre del grupo
                                </label>

                                <input
                                    bind:value={groupName}
                                    placeholder="Ej: Finanzas Parche"
                                    class="w-full p-3 rounded-xl border border-gray-200
                        focus:outline-none
                        focus:ring-2 focus:ring-emerald-500
                        focus:border-emerald-500
                        transition"
                                />
                            </div>

                            <div class="pt-2">
                                <Buttons onClick={createGroup}>
                                    {loading ? "Creando..." : "Crear Grupo"}
                                </Buttons>
                            </div>
                        {:else}
                            <!-- ADMINISTRAR GRUPO -->

                            <!-- Nombre -->
                            <div class="space-y-2">
                                <label
                                    class="text-sm font-medium text-gray-600"
                                    for="groupName"
                                >
                                    Nombre del grupo
                                </label>

                                <input
                                    bind:value={groupData.name}
                                    class="w-full p-3 rounded-xl border border-gray-200
                        focus:outline-none
                        focus:ring-2 focus:ring-emerald-500
                        transition"
                                />

                                {#if isOwner}
                                    <div class="pt-2">
                                        <Buttons onClick={updateGroupName}>
                                            Guardar nombre
                                        </Buttons>
                                    </div>
                                {/if}
                            </div>

                            <!-- Divider -->
                            <div class="border-t border-gray-100"></div>

                            <!-- MIEMBROS -->
                            <div>
                                <h3 class="font-semibold text-gray-700 mb-3">
                                    Miembros
                                </h3>

                                <div class="space-y-2">
                                    {#each members as member}
                                        <div
                                            class="flex justify-between items-center
                                p-3 rounded-xl
                                border border-gray-100
                                hover:bg-emerald-50/40
                                transition"
                                        >
                                            <span
                                                class="text-sm text-gray-700 break-all"
                                            >
                                                {member.id}
                                            </span>

                                            {#if isOwner && member.id !== auth.currentUser.uid}
                                                <button
                                                    on:click={() =>
                                                        removeMember(member.id)}
                                                    class="text-red-500 hover:text-red-700
                                        transition flex items-center gap-2"
                                                    aria-label="Eliminar miembro"
                                                >
                                                    <i
                                                        class="fa-solid fa-user-minus"
                                                    ></i>
                                                </button>
                                            {/if}
                                        </div>
                                    {/each}
                                </div>
                            </div>

                            {#if isOwner}
                                <!-- Zona peligrosa -->
                                <div class="pt-4 border-t border-gray-100">
                                    <Buttons onClick={deleteGroup}>
                                        Eliminar Grupo
                                    </Buttons>
                                </div>
                            {/if}
                        {/if}
                    </div>
                </div>
            </div>
        {/if}
    </div>
    <div>
        {#if invitePanelOpen}
            <div class="fixed inset-0 z-50 flex justify-end">
                <!-- Overlay -->
                <button
                    class="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    on:click={() => (invitePanelOpen = false)}
                >
                    <!-- xd -->
                </button>

                <!-- Panel -->
                <div
                    class="relative w-full sm:w-105 h-full
               bg-white
               shadow-2xl
               animate-slideIn
               flex flex-col"
                >
                    <!-- Header -->
                    <div
                        class="bg-linear-to-r from-emerald-600 to-green-600
                    text-white p-6 flex justify-between items-center"
                    >
                        <h2 class="text-lg font-semibold">Invitar al Grupo</h2>

                        <button
                            on:click={() => (invitePanelOpen = false)}
                            class="text-white hover:opacity-80"
                        >
                            <!-- cerrar -->
                            <i class="fa-solid fa-xmark text-xl"></i>
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="flex-1 p-6 space-y-6">
                        <div>
                            <label class="text-sm text-gray-500" for="email">
                                Email del usuario
                            </label>

                            <input
                                id="email"
                                type="email"
                                bind:value={inviteEmail}
                                placeholder="correo@gmail.com"
                                class="w-full mt-2 p-3 rounded-xl border border-gray-200
                           focus:outline-none focus:ring-2
                           focus:ring-emerald-500 transition"
                            />
                        </div>

                        <Buttons onClick={sendInvite}>
                            {loading ? "Enviando..." : "Enviar Invitación"}
                        </Buttons>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>

<!-- BOTTOM NAV (Mobile only) -->
<nav
    class="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-md
           bg-linear-to-r from-emerald-600/80 to-green-600/80
           backdrop-blur-xl
           border border-white/20
           shadow-2xl
           rounded-2xl
           flex justify-around items-center
           py-3
           sm:hidden"
>
    <a
        href="/home"
        class="flex flex-col items-center text-white/80 hover:text-white transition duration-200"
    >
        <i class="fa-solid fa-house text-lg"></i>
        <span class="text-xs font-medium mt-1">Home</span>
    </a>

    <a
        href="/home/income"
        class="flex flex-col items-center text-white/80 hover:text-white transition duration-200"
    >
        <i class="fa-solid fa-money-bill-trend-up text-lg"></i>
        <span class="text-xs font-medium mt-1">Ingresos</span>
    </a>

    <a
        href="/home/expense"
        class="flex flex-col items-center text-white/80 hover:text-white transition duration-200"
    >
        <i class="fa-solid fa-receipt text-lg"></i>
        <span class="text-xs font-medium mt-1">Egresos</span>
    </a>

    <a
        href="/home/profile"
        class="flex flex-col items-center text-white/80 hover:text-white transition duration-200"
    >
        <i class="fa-solid fa-user text-lg"></i>
        <span class="text-xs font-medium mt-1">Perfil</span>
    </a>
</nav>
