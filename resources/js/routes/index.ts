import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../wayfinder'
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

    /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
        loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    login.form = loginForm
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

    /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
    const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: logout.url(options),
        method: 'post',
    })

            /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
        logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: logout.url(options),
            method: 'post',
        })
    
    logout.form = logoutForm
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/'
 */
    const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: home.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/'
 */
        homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/'
 */
        homeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    home.form = homeForm
/**
 * @see routes/web.php:12
 * @route '/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/register',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:12
 * @route '/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:12
 * @route '/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:12
 * @route '/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:12
 * @route '/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:12
 * @route '/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:12
 * @route '/register'
 */
        registerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    register.form = registerForm
/**
* @see \App\Http\Controllers\DashboardController::demoLogin
 * @see app/Http/Controllers/DashboardController.php:91
 * @route '/demo-login'
 */
export const demoLogin = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: demoLogin.url(options),
    method: 'get',
})

demoLogin.definition = {
    methods: ["get","head"],
    url: '/demo-login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::demoLogin
 * @see app/Http/Controllers/DashboardController.php:91
 * @route '/demo-login'
 */
demoLogin.url = (options?: RouteQueryOptions) => {
    return demoLogin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::demoLogin
 * @see app/Http/Controllers/DashboardController.php:91
 * @route '/demo-login'
 */
demoLogin.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: demoLogin.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::demoLogin
 * @see app/Http/Controllers/DashboardController.php:91
 * @route '/demo-login'
 */
demoLogin.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: demoLogin.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::demoLogin
 * @see app/Http/Controllers/DashboardController.php:91
 * @route '/demo-login'
 */
    const demoLoginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: demoLogin.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::demoLogin
 * @see app/Http/Controllers/DashboardController.php:91
 * @route '/demo-login'
 */
        demoLoginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: demoLogin.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::demoLogin
 * @see app/Http/Controllers/DashboardController.php:91
 * @route '/demo-login'
 */
        demoLoginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: demoLogin.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    demoLogin.form = demoLoginForm
/**
* @see \App\Http\Controllers\DashboardController::dashboard
 * @see app/Http/Controllers/DashboardController.php:186
 * @route '/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::dashboard
 * @see app/Http/Controllers/DashboardController.php:186
 * @route '/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::dashboard
 * @see app/Http/Controllers/DashboardController.php:186
 * @route '/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::dashboard
 * @see app/Http/Controllers/DashboardController.php:186
 * @route '/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::dashboard
 * @see app/Http/Controllers/DashboardController.php:186
 * @route '/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::dashboard
 * @see app/Http/Controllers/DashboardController.php:186
 * @route '/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::dashboard
 * @see app/Http/Controllers/DashboardController.php:186
 * @route '/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Http\Controllers\DashboardController::earlyWarning
 * @see app/Http/Controllers/DashboardController.php:209
 * @route '/early-warning'
 */
export const earlyWarning = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: earlyWarning.url(options),
    method: 'get',
})

earlyWarning.definition = {
    methods: ["get","head"],
    url: '/early-warning',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::earlyWarning
 * @see app/Http/Controllers/DashboardController.php:209
 * @route '/early-warning'
 */
earlyWarning.url = (options?: RouteQueryOptions) => {
    return earlyWarning.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::earlyWarning
 * @see app/Http/Controllers/DashboardController.php:209
 * @route '/early-warning'
 */
earlyWarning.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: earlyWarning.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::earlyWarning
 * @see app/Http/Controllers/DashboardController.php:209
 * @route '/early-warning'
 */
earlyWarning.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: earlyWarning.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::earlyWarning
 * @see app/Http/Controllers/DashboardController.php:209
 * @route '/early-warning'
 */
    const earlyWarningForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: earlyWarning.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::earlyWarning
 * @see app/Http/Controllers/DashboardController.php:209
 * @route '/early-warning'
 */
        earlyWarningForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: earlyWarning.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::earlyWarning
 * @see app/Http/Controllers/DashboardController.php:209
 * @route '/early-warning'
 */
        earlyWarningForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: earlyWarning.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    earlyWarning.form = earlyWarningForm
/**
* @see \App\Http\Controllers\DashboardController::kondisiKelas
 * @see app/Http/Controllers/DashboardController.php:232
 * @route '/kondisi-kelas'
 */
export const kondisiKelas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kondisiKelas.url(options),
    method: 'get',
})

kondisiKelas.definition = {
    methods: ["get","head"],
    url: '/kondisi-kelas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::kondisiKelas
 * @see app/Http/Controllers/DashboardController.php:232
 * @route '/kondisi-kelas'
 */
kondisiKelas.url = (options?: RouteQueryOptions) => {
    return kondisiKelas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::kondisiKelas
 * @see app/Http/Controllers/DashboardController.php:232
 * @route '/kondisi-kelas'
 */
kondisiKelas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kondisiKelas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::kondisiKelas
 * @see app/Http/Controllers/DashboardController.php:232
 * @route '/kondisi-kelas'
 */
kondisiKelas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: kondisiKelas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::kondisiKelas
 * @see app/Http/Controllers/DashboardController.php:232
 * @route '/kondisi-kelas'
 */
    const kondisiKelasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: kondisiKelas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::kondisiKelas
 * @see app/Http/Controllers/DashboardController.php:232
 * @route '/kondisi-kelas'
 */
        kondisiKelasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: kondisiKelas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::kondisiKelas
 * @see app/Http/Controllers/DashboardController.php:232
 * @route '/kondisi-kelas'
 */
        kondisiKelasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: kondisiKelas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    kondisiKelas.form = kondisiKelasForm
/**
* @see \App\Http\Controllers\DashboardController::attributeScanner
 * @see app/Http/Controllers/DashboardController.php:264
 * @route '/pemantau-atribut'
 */
export const attributeScanner = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: attributeScanner.url(options),
    method: 'get',
})

attributeScanner.definition = {
    methods: ["get","head"],
    url: '/pemantau-atribut',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::attributeScanner
 * @see app/Http/Controllers/DashboardController.php:264
 * @route '/pemantau-atribut'
 */
attributeScanner.url = (options?: RouteQueryOptions) => {
    return attributeScanner.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::attributeScanner
 * @see app/Http/Controllers/DashboardController.php:264
 * @route '/pemantau-atribut'
 */
attributeScanner.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: attributeScanner.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::attributeScanner
 * @see app/Http/Controllers/DashboardController.php:264
 * @route '/pemantau-atribut'
 */
attributeScanner.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: attributeScanner.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::attributeScanner
 * @see app/Http/Controllers/DashboardController.php:264
 * @route '/pemantau-atribut'
 */
    const attributeScannerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: attributeScanner.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::attributeScanner
 * @see app/Http/Controllers/DashboardController.php:264
 * @route '/pemantau-atribut'
 */
        attributeScannerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: attributeScanner.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::attributeScanner
 * @see app/Http/Controllers/DashboardController.php:264
 * @route '/pemantau-atribut'
 */
        attributeScannerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: attributeScanner.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    attributeScanner.form = attributeScannerForm
/**
* @see \App\Http\Controllers\DashboardController::ats
 * @see app/Http/Controllers/DashboardController.php:400
 * @route '/alur-ats'
 */
export const ats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ats.url(options),
    method: 'get',
})

ats.definition = {
    methods: ["get","head"],
    url: '/alur-ats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::ats
 * @see app/Http/Controllers/DashboardController.php:400
 * @route '/alur-ats'
 */
ats.url = (options?: RouteQueryOptions) => {
    return ats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::ats
 * @see app/Http/Controllers/DashboardController.php:400
 * @route '/alur-ats'
 */
ats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ats.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::ats
 * @see app/Http/Controllers/DashboardController.php:400
 * @route '/alur-ats'
 */
ats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ats.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::ats
 * @see app/Http/Controllers/DashboardController.php:400
 * @route '/alur-ats'
 */
    const atsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ats.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::ats
 * @see app/Http/Controllers/DashboardController.php:400
 * @route '/alur-ats'
 */
        atsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ats.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::ats
 * @see app/Http/Controllers/DashboardController.php:400
 * @route '/alur-ats'
 */
        atsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ats.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ats.form = atsForm
/**
* @see \App\Http\Controllers\DashboardController::cases
 * @see app/Http/Controllers/DashboardController.php:422
 * @route '/manajemen-kasus'
 */
export const cases = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cases.url(options),
    method: 'get',
})

cases.definition = {
    methods: ["get","head"],
    url: '/manajemen-kasus',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::cases
 * @see app/Http/Controllers/DashboardController.php:422
 * @route '/manajemen-kasus'
 */
cases.url = (options?: RouteQueryOptions) => {
    return cases.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::cases
 * @see app/Http/Controllers/DashboardController.php:422
 * @route '/manajemen-kasus'
 */
cases.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cases.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::cases
 * @see app/Http/Controllers/DashboardController.php:422
 * @route '/manajemen-kasus'
 */
cases.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cases.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::cases
 * @see app/Http/Controllers/DashboardController.php:422
 * @route '/manajemen-kasus'
 */
    const casesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cases.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::cases
 * @see app/Http/Controllers/DashboardController.php:422
 * @route '/manajemen-kasus'
 */
        casesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cases.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::cases
 * @see app/Http/Controllers/DashboardController.php:422
 * @route '/manajemen-kasus'
 */
        casesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cases.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cases.form = casesForm
/**
* @see \App\Http\Controllers\DashboardController::communication
 * @see app/Http/Controllers/DashboardController.php:460
 * @route '/komunikasi-ortu'
 */
export const communication = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: communication.url(options),
    method: 'get',
})

communication.definition = {
    methods: ["get","head"],
    url: '/komunikasi-ortu',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::communication
 * @see app/Http/Controllers/DashboardController.php:460
 * @route '/komunikasi-ortu'
 */
communication.url = (options?: RouteQueryOptions) => {
    return communication.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::communication
 * @see app/Http/Controllers/DashboardController.php:460
 * @route '/komunikasi-ortu'
 */
communication.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: communication.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::communication
 * @see app/Http/Controllers/DashboardController.php:460
 * @route '/komunikasi-ortu'
 */
communication.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: communication.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::communication
 * @see app/Http/Controllers/DashboardController.php:460
 * @route '/komunikasi-ortu'
 */
    const communicationForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: communication.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::communication
 * @see app/Http/Controllers/DashboardController.php:460
 * @route '/komunikasi-ortu'
 */
        communicationForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: communication.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::communication
 * @see app/Http/Controllers/DashboardController.php:460
 * @route '/komunikasi-ortu'
 */
        communicationForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: communication.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    communication.form = communicationForm
/**
* @see \App\Http\Controllers\DashboardController::dapodik
 * @see app/Http/Controllers/DashboardController.php:482
 * @route '/dapodik'
 */
export const dapodik = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dapodik.url(options),
    method: 'get',
})

dapodik.definition = {
    methods: ["get","head"],
    url: '/dapodik',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::dapodik
 * @see app/Http/Controllers/DashboardController.php:482
 * @route '/dapodik'
 */
dapodik.url = (options?: RouteQueryOptions) => {
    return dapodik.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::dapodik
 * @see app/Http/Controllers/DashboardController.php:482
 * @route '/dapodik'
 */
dapodik.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dapodik.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::dapodik
 * @see app/Http/Controllers/DashboardController.php:482
 * @route '/dapodik'
 */
dapodik.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dapodik.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::dapodik
 * @see app/Http/Controllers/DashboardController.php:482
 * @route '/dapodik'
 */
    const dapodikForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dapodik.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::dapodik
 * @see app/Http/Controllers/DashboardController.php:482
 * @route '/dapodik'
 */
        dapodikForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dapodik.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::dapodik
 * @see app/Http/Controllers/DashboardController.php:482
 * @route '/dapodik'
 */
        dapodikForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dapodik.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dapodik.form = dapodikForm
/**
* @see \App\Http\Controllers\DashboardController::payments
 * @see app/Http/Controllers/DashboardController.php:500
 * @route '/pembayaran'
 */
export const payments = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payments.url(options),
    method: 'get',
})

payments.definition = {
    methods: ["get","head"],
    url: '/pembayaran',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::payments
 * @see app/Http/Controllers/DashboardController.php:500
 * @route '/pembayaran'
 */
payments.url = (options?: RouteQueryOptions) => {
    return payments.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::payments
 * @see app/Http/Controllers/DashboardController.php:500
 * @route '/pembayaran'
 */
payments.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payments.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::payments
 * @see app/Http/Controllers/DashboardController.php:500
 * @route '/pembayaran'
 */
payments.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payments.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::payments
 * @see app/Http/Controllers/DashboardController.php:500
 * @route '/pembayaran'
 */
    const paymentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: payments.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::payments
 * @see app/Http/Controllers/DashboardController.php:500
 * @route '/pembayaran'
 */
        paymentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: payments.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::payments
 * @see app/Http/Controllers/DashboardController.php:500
 * @route '/pembayaran'
 */
        paymentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: payments.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    payments.form = paymentsForm
/**
* @see \App\Http\Controllers\DashboardController::documents
 * @see app/Http/Controllers/DashboardController.php:679
 * @route '/dokumen-guru'
 */
export const documents = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: documents.url(options),
    method: 'get',
})

documents.definition = {
    methods: ["get","head"],
    url: '/dokumen-guru',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::documents
 * @see app/Http/Controllers/DashboardController.php:679
 * @route '/dokumen-guru'
 */
documents.url = (options?: RouteQueryOptions) => {
    return documents.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::documents
 * @see app/Http/Controllers/DashboardController.php:679
 * @route '/dokumen-guru'
 */
documents.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: documents.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::documents
 * @see app/Http/Controllers/DashboardController.php:679
 * @route '/dokumen-guru'
 */
documents.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: documents.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::documents
 * @see app/Http/Controllers/DashboardController.php:679
 * @route '/dokumen-guru'
 */
    const documentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: documents.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::documents
 * @see app/Http/Controllers/DashboardController.php:679
 * @route '/dokumen-guru'
 */
        documentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: documents.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::documents
 * @see app/Http/Controllers/DashboardController.php:679
 * @route '/dokumen-guru'
 */
        documentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: documents.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    documents.form = documentsForm
/**
* @see \App\Http\Controllers\DashboardController::incidents
 * @see app/Http/Controllers/DashboardController.php:722
 * @route '/respons-insiden'
 */
export const incidents = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: incidents.url(options),
    method: 'get',
})

incidents.definition = {
    methods: ["get","head"],
    url: '/respons-insiden',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::incidents
 * @see app/Http/Controllers/DashboardController.php:722
 * @route '/respons-insiden'
 */
incidents.url = (options?: RouteQueryOptions) => {
    return incidents.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::incidents
 * @see app/Http/Controllers/DashboardController.php:722
 * @route '/respons-insiden'
 */
incidents.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: incidents.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::incidents
 * @see app/Http/Controllers/DashboardController.php:722
 * @route '/respons-insiden'
 */
incidents.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: incidents.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::incidents
 * @see app/Http/Controllers/DashboardController.php:722
 * @route '/respons-insiden'
 */
    const incidentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: incidents.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::incidents
 * @see app/Http/Controllers/DashboardController.php:722
 * @route '/respons-insiden'
 */
        incidentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: incidents.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::incidents
 * @see app/Http/Controllers/DashboardController.php:722
 * @route '/respons-insiden'
 */
        incidentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: incidents.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    incidents.form = incidentsForm
/**
* @see \App\Http\Controllers\DashboardController::reports
 * @see app/Http/Controllers/DashboardController.php:740
 * @route '/rapor-siswa'
 */
export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

reports.definition = {
    methods: ["get","head"],
    url: '/rapor-siswa',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::reports
 * @see app/Http/Controllers/DashboardController.php:740
 * @route '/rapor-siswa'
 */
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::reports
 * @see app/Http/Controllers/DashboardController.php:740
 * @route '/rapor-siswa'
 */
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::reports
 * @see app/Http/Controllers/DashboardController.php:740
 * @route '/rapor-siswa'
 */
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::reports
 * @see app/Http/Controllers/DashboardController.php:740
 * @route '/rapor-siswa'
 */
    const reportsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reports.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::reports
 * @see app/Http/Controllers/DashboardController.php:740
 * @route '/rapor-siswa'
 */
        reportsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reports.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::reports
 * @see app/Http/Controllers/DashboardController.php:740
 * @route '/rapor-siswa'
 */
        reportsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reports.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reports.form = reportsForm