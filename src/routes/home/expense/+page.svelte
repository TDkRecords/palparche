<script>
    import Buttons from "$lib/Components/Buttons.svelte";
    import AddExpenseForm from "./components/AddExpenseForm.svelte";

    let showPanel = false;
</script>

<div class="flex flex-col items-center justify-start h-full gap-6">
    <header
        class="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
        <div class="flex flex-col">
            <h1 class="text-xl sm:text-2xl md:text-3xl font-bold">Egresos</h1>

            <p class="text-gray-500 text-sm sm:text-base max-w-md">
                Administrar lo que sale de sus bolsillos, sus cuentas y sus
                deudas.
            </p>
        </div>

        <div class="self-center sm:self-auto">
            <Buttons onClick={() => (showPanel = true)}>
                Registrar
                <i class="fa-solid fa-plus"></i>
            </Buttons>
        </div>
    </header>

    <main>
        <div
            class="bg-lime-100 w-[70dvw] h-[40dvh] flex flex-col justify-center items-center border-dashed border-2 border-lime-600/20 p-4"
        >
            <span class="text-black/25 text-bolder text-lg text-center">
                <i class="fa-solid fa-receipt text-4xl"></i>
                <p>No hay egresos registrados</p>
            </span>
        </div>
    </main>
    <section>
        <!-- SLIDE OVER -->
        <div class="fixed inset-0 z-50 pointer-events-none">
            <!-- Overlay -->
            <button
                class={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300
                ${showPanel ? "opacity-100 pointer-events-auto" : "opacity-0"}`}
                on:click={() => (showPanel = false)}
            >
                <!-- cerrar -->
            </button>

            <!-- Panel -->
            <div
                class={`absolute top-0 right-0 h-full w-full
                sm:w-130
                bg-linear-to-b from-emerald-600 to-green-600
                shadow-2xl
                transform transition-transform duration-300 ease-in-out rounded-3xl
                ${showPanel ? "translate-x-0 pointer-events-auto" : "translate-x-full"}`}
            >
                <!-- Card interior -->
                <div
                    class="h-full flex flex-col bg-white rounded-l-3xl shadow-xl"
                >
                    <!-- Header -->
                    <div
                        class="flex justify-between items-center
                        px-6 py-5
                        border-b border-gray-100"
                    >
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800">
                                Nuevo Egreso
                            </h2>
                            <p class="text-sm text-gray-500">
                                Registra un nuevo egreso
                            </p>
                        </div>

                        <button
                            on:click={() => (showPanel = false)}
                            class="w-10 h-10 flex items-center justify-center
                           rounded-xl
                           hover:bg-gray-100
                           transition"
                        >
                            <!-- cerrar -->
                            <i class="fa-solid fa-xmark text-gray-600"></i>
                        </button>
                    </div>

                    <!-- Contenido -->
                    <div class="flex-1 overflow-y-auto p-6 bg-gray-50">
                        <AddExpenseForm />
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
