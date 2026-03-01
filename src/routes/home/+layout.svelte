<script>
    let sidebarOpen = true;

    function reloadPage() {
        window.location.reload();
    }
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
            <a
                href="/home/groups"
                class="hover:opacity-80 cursor-pointer transition"
                title="Grupos"
            >
                <i class="fa-solid fa-users"></i>
            </a>

            <a
                href="/home/options"
                class="hover:opacity-80 cursor-pointer transition"
                title="Opciones de interfaz"
            >
                <i class="fa-solid fa-gear"></i>
            </a>

            <button
                on:click={reloadPage}
                class="hover:opacity-80 cursor-pointer transition"
                title="Recargar página"
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
            </nav>
        </aside>

        <!-- MAIN -->
        <div class="flex-1 overflow-auto">
            <main class="px-4 py-6 pb-24 sm:pb-6">
                <slot />
            </main>
        </div>
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
