<script>
    import { auth, db } from "$lib/js/firebase";
    import { onAuthStateChanged } from "firebase/auth";
    import { getDocs, collection } from "firebase/firestore";
    import { onMount } from "svelte";

    let user = null;
    let allGroups = [];
    let loading = true;

    async function loadAllData() {
        loading = true;

        try {
            const groupsSnap = await getDocs(collection(db, "groups"));

            allGroups = [];

            for (const groupDoc of groupsSnap.docs) {
                const groupData = groupDoc.data();

                // Cargar miembros
                const membersSnap = await getDocs(
                    collection(db, "groups", groupDoc.id, "members"),
                );
                const members = membersSnap.docs.map((m) => ({
                    id: m.id,
                    ...m.data(),
                }));

                // Cargar invitaciones
                const invitesSnap = await getDocs(
                    collection(db, "groups", groupDoc.id, "invites"),
                );
                const invites = invitesSnap.docs.map((i) => ({
                    id: i.id,
                    ...i.data(),
                }));

                allGroups.push({
                    id: groupDoc.id,
                    ...groupData,
                    members,
                    invites,
                });
            }

            console.log("📊 Datos completos:", allGroups);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        const unsubscribe = onAuthStateChanged(auth, async (u) => {
            user = u;
            if (u) {
                await loadAllData();
            }
        });

        return unsubscribe;
    });
</script>

<div class="p-8 max-w-6xl mx-auto">
    <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h1 class="text-2xl font-bold mb-4">🔍 Debug: Invitaciones</h1>

        {#if user}
            <div class="bg-emerald-50 p-4 rounded-lg mb-4">
                <p class="font-medium">Usuario actual:</p>
                <p class="text-sm text-gray-600">{user.email}</p>
                <p class="text-sm text-gray-600">UID: {user.uid}</p>
            </div>
        {:else}
            <p class="text-gray-500">No hay usuario autenticado</p>
        {/if}

        <button
            on:click={loadAllData}
            class="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
        >
            🔄 Recargar datos
        </button>
    </div>

    {#if loading}
        <p class="text-center text-gray-500">Cargando...</p>
    {:else if allGroups.length === 0}
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p class="text-yellow-800">No hay grupos en la base de datos</p>
        </div>
    {:else}
        <div class="space-y-6">
            {#each allGroups as group}
                <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <!-- Header del grupo -->
                    <div class="bg-emerald-600 text-white p-4">
                        <h2 class="text-xl font-bold">
                            {group.name || "Sin nombre"}
                        </h2>
                        <p class="text-sm text-emerald-100">ID: {group.id}</p>
                        <p class="text-sm text-emerald-100">
                            Owner: {group.ownerId}
                        </p>
                    </div>

                    <div class="p-6 space-y-6">
                        <!-- Miembros -->
                        <div>
                            <h3
                                class="font-semibold text-gray-700 mb-3 flex items-center gap-2"
                            >
                                <i class="fa-solid fa-users text-emerald-500"
                                ></i>
                                Miembros ({group.members.length})
                            </h3>

                            {#if group.members.length === 0}
                                <p class="text-gray-400 text-sm">
                                    No hay miembros
                                </p>
                            {:else}
                                <div class="space-y-2">
                                    {#each group.members as member}
                                        <div
                                            class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                        >
                                            <i
                                                class="fa-solid fa-user text-gray-400"
                                            ></i>
                                            <div class="flex-1">
                                                <p class="font-medium text-sm">
                                                    {member.id}
                                                </p>
                                                <p
                                                    class="text-xs text-gray-500"
                                                >
                                                    Rol: {member.role}
                                                </p>
                                            </div>
                                            {#if member.id === user?.uid}
                                                <span
                                                    class="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded"
                                                >
                                                    Tú
                                                </span>
                                            {/if}
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>

                        <!-- Invitaciones -->
                        <div>
                            <h3
                                class="font-semibold text-gray-700 mb-3 flex items-center gap-2"
                            >
                                <i class="fa-solid fa-envelope text-blue-500"
                                ></i>
                                Invitaciones ({group.invites.length})
                            </h3>

                            {#if group.invites.length === 0}
                                <p class="text-gray-400 text-sm">
                                    No hay invitaciones
                                </p>
                            {:else}
                                <div class="space-y-2">
                                    {#each group.invites as invite}
                                        {@const isForCurrentUser =
                                            invite.email
                                                ?.toLowerCase()
                                                .trim() ===
                                            user?.email?.toLowerCase().trim()}
                                        <div
                                            class="flex items-center gap-3 p-3 rounded-lg border-2"
                                            class:bg-yellow-50={isForCurrentUser &&
                                                invite.status === "pending"}
                                            class:border-yellow-300={isForCurrentUser &&
                                                invite.status === "pending"}
                                            class:bg-gray-50={!isForCurrentUser ||
                                                invite.status !== "pending"}
                                            class:border-gray-200={!isForCurrentUser ||
                                                invite.status !== "pending"}
                                        >
                                            <i
                                                class="fa-solid fa-envelope text-gray-400"
                                            ></i>
                                            <div class="flex-1">
                                                <p class="font-medium text-sm">
                                                    {invite.email}
                                                </p>
                                                <p
                                                    class="text-xs text-gray-500"
                                                >
                                                    Invitado por: {invite.invitedByEmail ||
                                                        invite.invitedBy}
                                                </p>
                                                <p
                                                    class="text-xs text-gray-500"
                                                >
                                                    Estado: <span
                                                        class="font-semibold"
                                                        >{invite.status}</span
                                                    >
                                                </p>
                                            </div>

                                            {#if isForCurrentUser && invite.status === "pending"}
                                                <div class="flex gap-2">
                                                    <span
                                                        class="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium"
                                                    >
                                                        ⚠️ Para ti
                                                    </span>
                                                </div>
                                            {/if}
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
