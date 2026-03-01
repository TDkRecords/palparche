<script>
    import { auth } from "$lib/js/firebase";

    export let members = [];
    export let isOwner = false;
    export let onRemoveMember;
</script>

<div class="border-t border-gray-100 pt-4 sm:pt-6">
    <h3 class="font-semibold text-gray-700 text-sm sm:text-base mb-3">
        <i class="fa-solid fa-users text-emerald-500 mr-2"></i>
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
                <div class="flex items-center gap-3 min-w-0 flex-1">
                    <div
                        class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0"
                    >
                        <i
                            class="fa-solid fa-user text-emerald-600 text-xs sm:text-sm"
                        ></i>
                    </div>
                    <div class="min-w-0 flex-1">
                        <p
                            class="text-sm sm:text-base text-gray-700 font-medium truncate"
                        >
                            {member.name}
                        </p>
                        {#if member.role === "owner"}
                            <span class="text-xs text-emerald-600 font-medium">
                                <i class="fa-solid fa-crown mr-1"></i>
                                Owner
                            </span>
                        {:else}
                            <span class="text-xs text-gray-500"> Miembro </span>
                        {/if}
                    </div>
                </div>

                {#if isOwner && member.id !== auth.currentUser?.uid}
                    <button
                        on:click={() => onRemoveMember(member.id)}
                        class="text-red-400 hover:text-red-600 transition p-2 rounded-lg hover:bg-red-50"
                        aria-label="Eliminar miembro"
                    >
                        <i class="fa-solid fa-user-minus text-sm sm:text-base"
                        ></i>
                    </button>
                {/if}
            </div>
        {/each}
    </div>
</div>
