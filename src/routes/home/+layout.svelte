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

    // ✅ Variable para forzar recarga
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

            groupPanelOpen = false;

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

            groupPanelOpen = false;

            alert("Grupo eliminado");
        } catch (error) {
            console.error(error);
            alert("Error al eliminar grupo");
        }
    }

    async function openGroupPanel() {
        await loadGroupData();
        groupPanelOpen = true;
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
            invitePanelOpen = false;

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

            // ✅ IMPORTANTE: Esperar un momento antes de cargar invitaciones
            setTimeout(async () => {
                await forceLoadInvites();
            }, 500);
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
                title="Grupos"
            >
                <i class="fa-solid fa-users"></i>
            </button>

            <button
                on:click={() => (invitePanelOpen = true)}
                class="hover:opacity-80 cursor-pointer transition"
                title="Invitar personas"
                disabled={!currentGroupId}
                class:opacity-50={!currentGroupId}
            >
                <i class="fa-solid fa-arrow-up-from-bracket"></i>
            </button>

            <!-- ✅ Botón de debug temporal -->
            <button
                on:click={forceLoadInvites}
                class="hover:opacity-80 cursor-pointer transition"
                title="Recargar invitaciones"
            >
                <i class="fa-solid fa-rotate-right"></i>
            </button>
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
                    aria-label={sidebarOpen
                        ? "Cerrar sidebar"
                        : "Abrir sidebar"}
                >
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

                <!-- ✅ Link temporal para debug -->
                <a
                    href="/home/debug-invites"
                    class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition bg-yellow-500/20"
                >
                    <i class="fa-solid fa-bug text-lg"></i>
                    {#if sidebarOpen}
                        <span class="font-medium">Debug</span>
                    {/if}
                </a>
            </nav>
        </aside>

        <!-- MAIN -->
        <div class="flex-1 overflow-auto">
            <!-- ✅ BANNER DE INVITACIONES MEJORADO -->
            {#if invites.length > 0}
                <div
                    class="sticky top-0 z-40 bg-linear-to-r from-yellow-400 to-orange-400 border-b-4 border-orange-500 shadow-lg"
                >
                    <div class="p-6 space-y-4">
                        <div class="flex items-center gap-3">
                            <div class="bg-white/20 p-3 rounded-full">
                                <i
                                    class="fa-solid fa-envelope text-white text-2xl"
                                ></i>
                            </div>
                            <div>
                                <h2 class="text-white font-bold text-xl">
                                    ¡Tienes {invites.length}
                                    {invites.length === 1
                                        ? "invitación"
                                        : "invitaciones"} pendiente{invites.length >
                                    1
                                        ? "s"
                                        : ""}!
                                </h2>
                                <p class="text-white/90 text-sm">
                                    Revisa y acepta para unirte al grupo
                                </p>
                            </div>
                        </div>

                        <div class="space-y-3">
                            {#each invites as invite}
                                <div
                                    class="bg-white rounded-xl p-4 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                                >
                                    <div class="flex-1">
                                        <p class="font-semibold text-gray-800">
                                            {invite.groupName}
                                        </p>
                                        <p class="text-sm text-gray-600">
                                            Invitado por: {invite.invitedByEmail ||
                                                invite.invitedBy}
                                        </p>
                                    </div>

                                    <div class="flex gap-2 w-full sm:w-auto">
                                        <button
                                            on:click={() =>
                                                acceptInvite(invite)}
                                            class="flex-1 sm:flex-none px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-medium"
                                        >
                                            ✅ Aceptar
                                        </button>

                                        <button
                                            on:click={() =>
                                                rejectInvite(invite)}
                                            class="flex-1 sm:flex-none px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                                        >
                                            ❌ Rechazar
                                        </button>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            {:else if invitesLoaded}
                <!-- ✅ Mostrar mensaje cuando ya cargó pero no hay invitaciones -->
                <div class="bg-gray-100 border-b border-gray-200 p-3">
                    <p class="text-center text-gray-500 text-sm">
                        <i class="fa-solid fa-check-circle text-gray-400"></i>
                        No tienes invitaciones pendientes
                    </p>
                </div>
            {/if}

            <main class="px-4 py-6 pb-24 sm:pb-6">
                <slot />
            </main>
        </div>
    </div>

    <!-- PANEL DE GRUPOS -->
    {#if groupPanelOpen}
        <div class="fixed inset-0 z-50 flex justify-end">
            <div
                class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
                on:click={() => (groupPanelOpen = false)}
                role="presentation"
            ></div>

            <div
                class="relative w-full sm:w-105 h-full
        bg-white
        shadow-2xl
        border-l border-emerald-100
        animate-slideIn
        flex flex-col"
            >
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

                <div
                    class="flex-1 p-6 space-y-8 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-200"
                >
                    {#if !currentGroupId}
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
                        <div class="space-y-2">
                            <label
                                class="text-sm font-medium text-gray-600"
                                for="groupName"
                            >
                                Nombre del grupo
                            </label>

                            <input
                                bind:value={groupData.name}
                                disabled={!isOwner}
                                class="w-full p-3 rounded-xl border border-gray-200
                        focus:outline-none
                        focus:ring-2 focus:ring-emerald-500
                        transition"
                                class:bg-gray-100={!isOwner}
                            />

                            {#if isOwner}
                                <div class="pt-2">
                                    <Buttons onClick={updateGroupName}>
                                        Guardar nombre
                                    </Buttons>
                                </div>
                            {/if}
                        </div>

                        <div class="border-t border-gray-100"></div>

                        <div>
                            <h3 class="font-semibold text-gray-700 mb-3">
                                Miembros ({members.length})
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
                                            {#if member.role === "owner"}
                                                <span
                                                    class="text-xs text-emerald-600 font-medium"
                                                >
                                                    (Owner)
                                                </span>
                                            {/if}
                                        </span>

                                        {#if isOwner && member.id !== auth.currentUser?.uid}
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
                            <div class="pt-4 border-t border-gray-100">
                                <button
                                    on:click={deleteGroup}
                                    class="w-full py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                                >
                                    <i class="fa-solid fa-trash mr-2"></i>
                                    Eliminar Grupo
                                </button>
                            </div>
                        {/if}
                    {/if}
                </div>
            </div>
        </div>
    {/if}

    <!-- PANEL DE INVITACIONES -->
    {#if invitePanelOpen}
        <div class="fixed inset-0 z-50 flex justify-end">
            <button
                class="absolute inset-0 bg-black/40 backdrop-blur-sm"
                on:click={() => (invitePanelOpen = false)}
                aria-label="Cerrar panel de invitaciones"
            >
            </button>

            <div
                class="relative w-full sm:w-105 h-full
               bg-white
               shadow-2xl
               animate-slideIn
               flex flex-col"
            >
                <div
                    class="bg-linear-to-r from-emerald-600 to-green-600
                    text-white p-6 flex justify-between items-center"
                >
                    <h2 class="text-lg font-semibold">Invitar al Grupo</h2>

                    <button
                        on:click={() => (invitePanelOpen = false)}
                        class="text-white hover:opacity-80"
                        aria-label="Cerrar panel de invitaciones"
                    >
                        <i class="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>

                <div class="flex-1 p-6 space-y-6">
                    {#if !currentGroupId}
                        <div
                            class="p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
                        >
                            <p class="text-sm text-yellow-800">
                                <i class="fa-solid fa-exclamation-triangle mr-2"
                                ></i>
                                Debes crear o unirte a un grupo antes de enviar invitaciones.
                            </p>
                        </div>
                    {:else}
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
                    {/if}
                </div>
            </div>
        </div>
    {/if}
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
