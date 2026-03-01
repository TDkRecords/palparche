<script>
    export let invites = [];
    export let invitesLoaded = false;
    export let onAcceptInvite;
    export let onRejectInvite;
</script>

{#if invites.length > 0}
    <div
        class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
    >
        <!-- Header con degradado -->
        <div
            class="bg-linear-to-r from-yellow-400 to-orange-500 px-4 sm:px-6 py-4"
        >
            <div class="flex items-center gap-3">
                <div class="bg-white/20 p-2 sm:p-3 rounded-full">
                    <i
                        class="fa-solid fa-envelope text-white text-lg sm:text-2xl"
                    ></i>
                </div>
                <div>
                    <h2 class="text-white font-bold text-base sm:text-lg">
                        ¡Tienes {invites.length}
                        {invites.length === 1 ? "invitación" : "invitaciones"} pendiente{invites.length >
                        1
                            ? "s"
                            : ""}!
                    </h2>
                    <p class="text-white/90 text-xs sm:text-sm">
                        Revisa y acepta para unirte al grupo
                    </p>
                </div>
            </div>
        </div>

        <!-- Lista de invitaciones -->
        <div class="p-4 sm:p-6 space-y-3">
            {#each invites as invite}
                <div
                    class="bg-gray-50 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                >
                    <div class="flex-1 min-w-0">
                        <p
                            class="font-semibold text-gray-800 text-sm sm:text-base truncate"
                        >
                            {invite.groupName}
                        </p>
                        <p class="text-xs sm:text-sm text-gray-600 mt-1">
                            Invitado por: {invite.invitedByEmail ||
                                invite.invitedBy}
                        </p>
                    </div>

                    <div class="flex gap-2 w-full sm:w-auto">
                        <button
                            on:click={() => onAcceptInvite(invite)}
                            class="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-medium"
                        >
                            <i class="fa-solid fa-check mr-1"></i>
                            Aceptar
                        </button>

                        <button
                            on:click={() => onRejectInvite(invite)}
                            class="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                        >
                            <i class="fa-solid fa-xmark mr-1"></i>
                            Rechazar
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    </div>
{:else if invitesLoaded}
    <span></span>
{/if}
