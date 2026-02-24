<script>
    import { auth, db } from "$lib/js/firebase";
    import { onMount } from "svelte";
    import { onAuthStateChanged, signOut } from "firebase/auth";
    import { doc, getDoc } from "firebase/firestore";

    let user = null;
    let userData = null;
    let groupData = null;
    let memberData = null;
    let loading = true;

    async function loadUserProfile() {
        loading = true;

        try {
            // Cargar datos del usuario desde Firestore
            const userDocRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
                userData = userSnap.data();

                // Si tiene grupo, cargar info del grupo
                if (userData.currentGroupId) {
                    const groupRef = doc(db, "groups", userData.currentGroupId);
                    const groupSnap = await getDoc(groupRef);

                    if (groupSnap.exists()) {
                        groupData = {
                            id: userData.currentGroupId,
                            ...groupSnap.data(),
                        };

                        // Cargar info del miembro
                        const memberRef = doc(
                            db,
                            "groups",
                            userData.currentGroupId,
                            "members",
                            user.uid,
                        );
                        const memberSnap = await getDoc(memberRef);

                        if (memberSnap.exists()) {
                            memberData = memberSnap.data();
                        }
                    }
                }
            }

            console.log("📊 Perfil cargado:", {
                userData,
                groupData,
                memberData,
            });
        } catch (error) {
            console.error("Error cargando perfil:", error);
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        const unsubscribe = onAuthStateChanged(auth, async (u) => {
            user = u;
            if (u) {
                await loadUserProfile();
            } else {
                loading = false;
            }
        });

        return unsubscribe;
    });

    async function logout() {
        try {
            await signOut(auth);
            window.location.href = "/";
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            alert("Error al cerrar sesión");
        }
    }

    function formatDate(timestamp) {
        if (!timestamp) return "N/A";

        try {
            const date = timestamp.toDate();
            return date.toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch (e) {
            return "N/A";
        }
    }
</script>

<div class="min-h-screen bg-gray-50 overflow-x-hidden pb-20">
    {#if loading}
        <div class="flex items-center justify-center min-h-screen">
            <div class="text-center">
                <i class="fa-solid fa-spinner fa-spin text-4xl text-emerald-500"
                ></i>
                <p class="mt-4 text-gray-600">Cargando perfil...</p>
            </div>
        </div>
    {:else if !user}
        <div class="flex items-center justify-center min-h-screen">
            <div class="text-center">
                <i class="fa-solid fa-user-slash text-4xl text-gray-400"></i>
                <p class="mt-4 text-gray-600">No has iniciado sesión</p>
            </div>
        </div>
    {:else}
        <!-- HEADER -->
        <div
            class="bg-linear-to-r from-emerald-600 to-green-600 pb-28 sm:pb-32"
        >
            <div
                class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 text-center text-white"
            >
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold">
                    Mi Perfil
                </h1>
                <p class="text-emerald-100 mt-2 text-sm sm:text-base">
                    Administra tu información y configuración
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
                        src={user.photoURL || "/images/default-avatar.png"}
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
                    class="mt-5 text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 wrap-break-word max-w-full"
                >
                    {user.displayName || "Usuario"}
                </h2>

                <p
                    class="text-gray-500 text-xs sm:text-sm mt-1 break-all max-w-full"
                >
                    {user.email}
                </p>

                {#if groupData}
                    <span
                        class="mt-4 inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700"
                    >
                        <i class="fa-solid fa-users text-xs"></i>
                        Miembro de {groupData.name}
                    </span>
                {:else}
                    <span
                        class="mt-4 inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600"
                    >
                        <i class="fa-solid fa-user text-xs"></i>
                        Sin grupo
                    </span>
                {/if}
            </div>

            <!-- GRID DE INFORMACIÓN -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- INFORMACIÓN PERSONAL -->
                <div
                    class="bg-white rounded-2xl shadow-md p-5 sm:p-6 space-y-4"
                >
                    <h3
                        class="font-semibold text-gray-800 flex items-center gap-2 text-sm sm:text-base"
                    >
                        <i class="fa-solid fa-id-card text-emerald-500"></i>
                        Información Personal
                    </h3>

                    <div class="space-y-3 text-xs sm:text-sm">
                        <div class="flex justify-between items-start">
                            <span class="text-gray-500">Nombre:</span>
                            <span
                                class="font-medium text-gray-800 text-right wrap-break-word max-w-[60%]"
                            >
                                {user.displayName || "N/A"}
                            </span>
                        </div>

                        <div class="flex justify-between items-start">
                            <span class="text-gray-500">Email:</span>
                            <span
                                class="font-medium text-gray-800 text-right break-all max-w-[60%]"
                            >
                                {user.email}
                            </span>
                        </div>

                        <div class="flex justify-between items-start">
                            <span class="text-gray-500">UID:</span>
                            <span
                                class="font-mono text-xs text-gray-600 text-right break-all max-w-[60%]"
                            >
                                {user.uid}
                            </span>
                        </div>

                        <div class="flex justify-between items-start">
                            <span class="text-gray-500">Cuenta creada:</span>
                            <span class="font-medium text-gray-800 text-right">
                                {formatDate(userData?.createdAt)}
                            </span>
                        </div>

                        <div class="flex justify-between items-start">
                            <span class="text-gray-500">Verificado:</span>
                            <span class="font-medium text-gray-800">
                                {#if user.emailVerified}
                                    <i
                                        class="fa-solid fa-check-circle text-emerald-500"
                                    ></i>
                                    Sí
                                {:else}
                                    <i
                                        class="fa-solid fa-times-circle text-gray-400"
                                    ></i>
                                    No
                                {/if}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- INFORMACIÓN DEL GRUPO -->
                <div
                    class="bg-white rounded-2xl shadow-md p-5 sm:p-6 space-y-4"
                >
                    <h3
                        class="font-semibold text-gray-800 flex items-center gap-2 text-sm sm:text-base"
                    >
                        <i class="fa-solid fa-people-group text-emerald-500"
                        ></i>
                        Información del Grupo
                    </h3>

                    {#if groupData}
                        <div class="space-y-3 text-xs sm:text-sm">
                            <div class="flex justify-between items-start">
                                <span class="text-gray-500">Grupo:</span>
                                <span
                                    class="font-medium text-gray-800 text-right wrap-break-word max-w-[60%]"
                                >
                                    {groupData.name}
                                </span>
                            </div>

                            <div class="flex justify-between items-start">
                                <span class="text-gray-500">Tu rol:</span>
                                <span class="font-medium text-gray-800">
                                    {#if memberData?.role === "owner"}
                                        <span class="text-emerald-600">
                                            <i class="fa-solid fa-crown"></i>
                                            Propietario
                                        </span>
                                    {:else if memberData?.role === "admin"}
                                        <span class="text-blue-600">
                                            <i class="fa-solid fa-user-shield"
                                            ></i>
                                            Administrador
                                        </span>
                                    {:else}
                                        <span class="text-gray-600">
                                            <i class="fa-solid fa-user"></i>
                                            Miembro
                                        </span>
                                    {/if}
                                </span>
                            </div>

                            <div class="flex justify-between items-start">
                                <span class="text-gray-500">Unido el:</span>
                                <span
                                    class="font-medium text-gray-800 text-right"
                                >
                                    {formatDate(memberData?.joinedAt)}
                                </span>
                            </div>

                            <div class="flex justify-between items-start">
                                <span class="text-gray-500">Grupo creado:</span>
                                <span
                                    class="font-medium text-gray-800 text-right"
                                >
                                    {formatDate(groupData?.createdAt)}
                                </span>
                            </div>

                            <div class="flex justify-between items-start">
                                <span class="text-gray-500">ID del grupo:</span>
                                <span
                                    class="font-mono text-xs text-gray-600 text-right break-all max-w-[60%]"
                                >
                                    {groupData.id}
                                </span>
                            </div>
                        </div>
                    {:else}
                        <div class="text-center py-6">
                            <i
                                class="fa-solid fa-users-slash text-4xl text-gray-300 mb-3"
                            ></i>
                            <p class="text-gray-500 text-sm">
                                No perteneces a ningún grupo
                            </p>
                            <p class="text-gray-400 text-xs mt-2">
                                Crea uno o acepta una invitación
                            </p>
                        </div>
                    {/if}
                </div>

                <!-- SEGURIDAD -->
                <div
                    class="bg-white rounded-2xl shadow-md p-5 sm:p-6 flex flex-col justify-between"
                >
                    <div>
                        <h3
                            class="font-semibold text-gray-800 flex items-center gap-2 text-sm sm:text-base mb-4"
                        >
                            <i
                                class="fa-solid fa-shield-halved text-emerald-500"
                            ></i>
                            Seguridad
                        </h3>

                        <div class="space-y-3 text-xs sm:text-sm">
                            <div
                                class="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg"
                            >
                                <i
                                    class="fa-solid fa-check-circle text-emerald-500 mt-0.5"
                                ></i>
                                <div>
                                    <p class="font-medium text-gray-800">
                                        Autenticación segura
                                    </p>
                                    <p class="text-gray-600 text-xs mt-1">
                                        Tu sesión está protegida mediante Google
                                    </p>
                                </div>
                            </div>

                            <div
                                class="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                            >
                                <i
                                    class="fa-solid fa-database text-blue-500 mt-0.5"
                                ></i>
                                <div>
                                    <p class="font-medium text-gray-800">
                                        Datos encriptados
                                    </p>
                                    <p class="text-gray-600 text-xs mt-1">
                                        Tu información está protegida con
                                        Firebase
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        on:click={logout}
                        class="mt-6 w-full py-2.5 sm:py-3 rounded-xl
                               bg-linear-to-r from-red-500 to-rose-500
                               text-sm sm:text-base text-white font-medium
                               hover:opacity-90 active:scale-[0.98]
                               transition shadow-md"
                    >
                        <i class="fa-solid fa-right-from-bracket mr-2"></i>
                        Cerrar sesión
                    </button>
                </div>

                <!-- ESTADÍSTICAS (placeholder para futuro) -->
                <div
                    class="bg-white rounded-2xl shadow-md p-5 sm:p-6 space-y-4"
                >
                    <h3
                        class="font-semibold text-gray-800 flex items-center gap-2 text-sm sm:text-base"
                    >
                        <i class="fa-solid fa-chart-line text-emerald-500"></i>
                        Resumen de Actividad
                    </h3>

                    <div class="grid grid-cols-2 gap-3">
                        <div class="p-3 bg-emerald-50 rounded-lg text-center">
                            <i
                                class="fa-solid fa-plus text-emerald-500 text-xl mb-2"
                            ></i>
                            <p class="text-2xl font-bold text-gray-800">0</p>
                            <p class="text-xs text-gray-600">Ingresos</p>
                        </div>

                        <div class="p-3 bg-rose-50 rounded-lg text-center">
                            <i
                                class="fa-solid fa-minus text-rose-500 text-xl mb-2"
                            ></i>
                            <p class="text-2xl font-bold text-gray-800">0</p>
                            <p class="text-xs text-gray-600">Egresos</p>
                        </div>

                        <div class="p-3 bg-blue-50 rounded-lg text-center">
                            <i
                                class="fa-solid fa-calendar text-blue-500 text-xl mb-2"
                            ></i>
                            <p class="text-2xl font-bold text-gray-800">0</p>
                            <p class="text-xs text-gray-600">Días activo</p>
                        </div>

                        <div class="p-3 bg-purple-50 rounded-lg text-center">
                            <i
                                class="fa-solid fa-clock text-purple-500 text-xl mb-2"
                            ></i>
                            <p class="text-2xl font-bold text-gray-800">
                                {#if userData?.createdAt}
                                    {Math.floor(
                                        (Date.now() -
                                            userData.createdAt
                                                .toDate()
                                                .getTime()) /
                                            (1000 * 60 * 60 * 24),
                                    )}
                                {:else}
                                    0
                                {/if}
                            </p>
                            <p class="text-xs text-gray-600">Días registrado</p>
                        </div>
                    </div>

                    <p class="text-xs text-gray-400 text-center pt-2">
                        Las estadísticas se actualizarán conforme uses la app
                    </p>
                </div>
            </div>
        </div>
    {/if}
</div>
