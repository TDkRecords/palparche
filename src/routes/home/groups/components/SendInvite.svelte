<script>
    import Buttons from "$lib/Components/Buttons.svelte";

    export let inviteEmail = "";
    export let loading = false;
    export let onSendInvite;
</script>

<div class="border-t border-gray-100 pt-4 sm:pt-6">
    <h3 class="font-semibold text-gray-700 text-sm sm:text-base mb-3">
        <i class="fa-solid fa-paper-plane text-emerald-500 mr-2"></i>
        Invitar persona al grupo
    </h3>

    <div class="space-y-3">
        <div>
            <label class="text-xs sm:text-sm text-gray-500" for="email">
                Email del usuario
            </label>

            <input
                id="email"
                type="email"
                bind:value={inviteEmail}
                placeholder="correo@gmail.com"
                class="w-full mt-2 p-3 rounded-xl border border-gray-200 text-sm sm:text-base
                focus:outline-none focus:ring-2
                focus:ring-emerald-500 transition"
            />
        </div>

        <Buttons onClick={onSendInvite}>
            {#if loading}
                <i class="fa-solid fa-spinner fa-spin mr-2"></i>
                Enviando...
            {:else}
                <i class="fa-solid fa-paper-plane mr-2"></i>
                Enviar Invitación
            {/if}
        </Buttons>
    </div>
</div>
