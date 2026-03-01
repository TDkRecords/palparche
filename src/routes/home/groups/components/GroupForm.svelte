<script>
    import Buttons from "$lib/Components/Buttons.svelte";

    export let currentGroupId = null;
    export let groupData = null;
    export let isOwner = false;
    export let loading = false;
    export let groupName = "";

    export let onCreateGroup;
    export let onUpdateGroupName;
    export let onDeleteGroup;
</script>

<div
    class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
>
    <div
        class="bg-linear-to-r from-emerald-600 to-green-600 text-white px-4 sm:px-6 py-4"
    >
        <h2 class="text-base sm:text-lg font-semibold">
            {#if !currentGroupId}
                Crear Grupo
            {:else}
                Administrar Grupo
            {/if}
        </h2>
    </div>

    <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {#if !currentGroupId}
            <div class="space-y-2">
                <label
                    class="text-xs sm:text-sm font-medium text-gray-600"
                    for="groupName"
                >
                    Nombre del grupo
                </label>

                <input
                    bind:value={groupName}
                    placeholder="Ej: Finanzas Parche"
                    class="w-full p-3 rounded-xl border border-gray-200 text-sm sm:text-base
                    focus:outline-none
                    focus:ring-2 focus:ring-emerald-500
                    focus:border-emerald-500
                    transition"
                />
            </div>

            <div class="pt-2">
                <Buttons onClick={onCreateGroup}>
                    {loading ? "Creando..." : "Crear Grupo"}
                </Buttons>
            </div>
        {:else}
            <div class="space-y-2">
                <label
                    class="text-xs sm:text-sm font-medium text-gray-600"
                    for="groupName"
                >
                    Nombre del grupo
                </label>

                <input
                    bind:value={groupData.name}
                    disabled={!isOwner}
                    class="w-full p-3 rounded-xl border border-gray-200 text-sm sm:text-base
                    focus:outline-none
                    focus:ring-2 focus:ring-emerald-500
                    transition"
                    class:bg-gray-100={!isOwner}
                />

                {#if isOwner}
                    <div class="pt-2">
                        <Buttons onClick={onUpdateGroupName}>
                            Guardar nombre
                        </Buttons>
                    </div>
                {/if}
            </div>

            <slot name="members" />

            <slot name="invite" />

            {#if isOwner}
                <div class="pt-4 border-t border-gray-100">
                    <button
                        on:click={onDeleteGroup}
                        class="w-full py-2.5 sm:py-3 text-sm sm:text-base bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                    >
                        <i class="fa-solid fa-trash mr-2"></i>
                        Eliminar Grupo
                    </button>
                </div>
            {/if}
        {/if}
    </div>
</div>
