<script>
    export let onClick;
</script>

<button
    on:click={onClick}
    class="
    group relative inline-flex items-center gap-2
           px-6 py-2 rounded-xl font-semibold text-white
           bg-linear-to-l from-emerald-600 to-green-700
           
           transition-all duration-120 ease-out
           
           shadow-[0_6px_0_#15803d]
           hover:shadow-[0_4px_0_#15803d]
           active:shadow-[0_1px_0_#15803d]
           
           hover:translate-y-0.5
           active:translate-y-1.25
           
    "
>
    <slot />
</button>
