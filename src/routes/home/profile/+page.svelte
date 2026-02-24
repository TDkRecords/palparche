<script>
    import { auth } from "$lib/js/firebase";
    import { onMount } from "svelte";
    import { onAuthStateChanged, signOut } from "firebase/auth";

    let user = null;

    onMount(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            user = u;
        });

        return unsubscribe;
    });

    async function logout() {
        await signOut(auth);
        window.location.href = "/";
    }
</script>

<div class="min-h-screen bg-gray-50 overflow-x-hidden">
    <!-- HEADER -->
    <div class="bg-linear-to-r from-emerald-600 to-green-600 pb-28 sm:pb-32">
        <div
            class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 text-center text-white"
        >
            <h1 class="text-xl sm:text-3xl lg:text-4xl font-bold">Mi Perfil</h1>
            <p class="text-emerald-100 mt-2 text-xs sm:text-base">
                Administra tu información y tu grupo
            </p>
        </div>
    </div>

    <!-- CONTENIDO PRINCIPAL -->
    <div
        class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 pb-12 sm:pb-16 space-y-6"
    >
        <!-- CARD PERFIL -->
        <div
            class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col items-center text-center"
        >
            <div class="relative">
                <img
                    src={user?.photoURL}
                    alt="Foto de perfil"
                    class="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />

                <div
                    class="absolute -bottom-2 -right-2 bg-emerald-500 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-md"
                >
                    <i
                        class="fa-solid fa-check text-white text-[10px] sm:text-xs"
                    ></i>
                </div>
            </div>

            <h2
                class="mt-5 text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 wrap-break-words"
            >
                {user?.displayName}
            </h2>

            <p class="text-gray-500 text-xs sm:text-sm mt-1 break-all">
                {user?.email}
            </p>

            <span
                class="mt-4 inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700"
            >
                <i class="fa-solid fa-users text-xs"></i>
                Miembro activo
            </span>
        </div>

        <!-- GRID DE INFORMACIÓN -->
        <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6">
            <!-- GRUPO -->
            <div class="bg-white rounded-2xl shadow-md p-5 sm:p-6 space-y-4">
                <h3
                    class="font-semibold text-gray-800 flex items-center gap-2 text-sm sm:text-base"
                >
                    <i class="fa-solid fa-people-group text-emerald-500"></i>
                    Información del Grupo
                </h3>

                <div class="space-y-2 text-xs sm:text-sm text-gray-600">
                    <p>
                        <span class="font-medium text-gray-800">Nombre:</span>
                        Grupo Familiar
                    </p>
                    <p>
                        <span class="font-medium text-gray-800">Rol:</span>
                        Owner
                    </p>
                    <p>
                        <span class="font-medium text-gray-800">Miembros:</span>
                        3 personas
                    </p>
                </div>
            </div>

            <!-- SESIÓN -->
            <div
                class="bg-white rounded-2xl shadow-md p-5 sm:p-6 flex flex-col justify-between"
            >
                <div>
                    <h3
                        class="font-semibold text-gray-800 flex items-center gap-2 text-sm sm:text-base"
                    >
                        <i class="fa-solid fa-shield-halved text-emerald-500"
                        ></i>
                        Seguridad
                    </h3>

                    <p class="text-xs sm:text-sm text-gray-500 mt-2">
                        Tu sesión está protegida mediante autenticación con
                        Google.
                    </p>
                </div>

                <button
                    on:click={logout}
                    class="mt-6 w-full py-2.5 sm:py-3 rounded-xl
                           bg-linear-to-r from-red-500 to-rose-500
                           text-sm sm:text-base text-white font-medium
                           hover:opacity-90 active:scale-[0.98]
                           transition shadow-sm"
                >
                    <i class="fa-solid fa-right-from-bracket mr-2"></i>
                    Cerrar sesión
                </button>
            </div>
        </div>
    </div>
</div>
