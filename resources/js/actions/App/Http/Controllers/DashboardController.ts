import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardController::switchRole
 * @see app/Http/Controllers/DashboardController.php:81
 * @route '/demo-login'
 */
const switchRole807e51dd99aee88b96cada07f288652a = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: switchRole807e51dd99aee88b96cada07f288652a.url(options),
    method: 'get',
})

switchRole807e51dd99aee88b96cada07f288652a.definition = {
    methods: ["get","head"],
    url: '/demo-login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::switchRole
 * @see app/Http/Controllers/DashboardController.php:81
 * @route '/demo-login'
 */
switchRole807e51dd99aee88b96cada07f288652a.url = (options?: RouteQueryOptions) => {
    return switchRole807e51dd99aee88b96cada07f288652a.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::switchRole
 * @see app/Http/Controllers/DashboardController.php:81
 * @route '/demo-login'
 */
switchRole807e51dd99aee88b96cada07f288652a.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: switchRole807e51dd99aee88b96cada07f288652a.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::switchRole
 * @see app/Http/Controllers/DashboardController.php:81
 * @route '/demo-login'
 */
switchRole807e51dd99aee88b96cada07f288652a.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: switchRole807e51dd99aee88b96cada07f288652a.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::switchRole
 * @see app/Http/Controllers/DashboardController.php:81
 * @route '/demo-login'
 */
    const switchRole807e51dd99aee88b96cada07f288652aForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: switchRole807e51dd99aee88b96cada07f288652a.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::switchRole
 * @see app/Http/Controllers/DashboardController.php:81
 * @route '/demo-login'
 */
        switchRole807e51dd99aee88b96cada07f288652aForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: switchRole807e51dd99aee88b96cada07f288652a.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::switchRole
 * @see app/Http/Controllers/DashboardController.php:81
 * @route '/demo-login'
 */
        switchRole807e51dd99aee88b96cada07f288652aForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: switchRole807e51dd99aee88b96cada07f288652a.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    switchRole807e51dd99aee88b96cada07f288652a.form = switchRole807e51dd99aee88b96cada07f288652aForm
    /**
* @see \App\Http\Controllers\DashboardController::switchRole
 * @see app/Http/Controllers/DashboardController.php:81
 * @route '/switch-role'
 */
const switchRole81e04750843c04b5882f8bd8f683fd86 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: switchRole81e04750843c04b5882f8bd8f683fd86.url(options),
    method: 'post',
})

switchRole81e04750843c04b5882f8bd8f683fd86.definition = {
    methods: ["post"],
    url: '/switch-role',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::switchRole
 * @see app/Http/Controllers/DashboardController.php:81
 * @route '/switch-role'
 */
switchRole81e04750843c04b5882f8bd8f683fd86.url = (options?: RouteQueryOptions) => {
    return switchRole81e04750843c04b5882f8bd8f683fd86.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::switchRole
 * @see app/Http/Controllers/DashboardController.php:81
 * @route '/switch-role'
 */
switchRole81e04750843c04b5882f8bd8f683fd86.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: switchRole81e04750843c04b5882f8bd8f683fd86.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::switchRole
 * @see app/Http/Controllers/DashboardController.php:81
 * @route '/switch-role'
 */
    const switchRole81e04750843c04b5882f8bd8f683fd86Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: switchRole81e04750843c04b5882f8bd8f683fd86.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::switchRole
 * @see app/Http/Controllers/DashboardController.php:81
 * @route '/switch-role'
 */
        switchRole81e04750843c04b5882f8bd8f683fd86Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: switchRole81e04750843c04b5882f8bd8f683fd86.url(options),
            method: 'post',
        })
    
    switchRole81e04750843c04b5882f8bd8f683fd86.form = switchRole81e04750843c04b5882f8bd8f683fd86Form

/**
* Multiple routes resolve to \App\Http\Controllers\DashboardController::switchRole, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `switchRole['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const switchRole = {
    '/demo-login': switchRole807e51dd99aee88b96cada07f288652a,
    '/switch-role': switchRole81e04750843c04b5882f8bd8f683fd86,
}

/**
* @see \App\Http\Controllers\DashboardController::openOperator
 * @see app/Http/Controllers/DashboardController.php:33
 * @route '/operator'
 */
export const openOperator = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: openOperator.url(options),
    method: 'get',
})

openOperator.definition = {
    methods: ["get","head"],
    url: '/operator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::openOperator
 * @see app/Http/Controllers/DashboardController.php:33
 * @route '/operator'
 */
openOperator.url = (options?: RouteQueryOptions) => {
    return openOperator.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::openOperator
 * @see app/Http/Controllers/DashboardController.php:33
 * @route '/operator'
 */
openOperator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: openOperator.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::openOperator
 * @see app/Http/Controllers/DashboardController.php:33
 * @route '/operator'
 */
openOperator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: openOperator.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::openOperator
 * @see app/Http/Controllers/DashboardController.php:33
 * @route '/operator'
 */
    const openOperatorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: openOperator.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::openOperator
 * @see app/Http/Controllers/DashboardController.php:33
 * @route '/operator'
 */
        openOperatorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: openOperator.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::openOperator
 * @see app/Http/Controllers/DashboardController.php:33
 * @route '/operator'
 */
        openOperatorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: openOperator.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    openOperator.form = openOperatorForm
/**
* @see \App\Http\Controllers\DashboardController::openGuruBk
 * @see app/Http/Controllers/DashboardController.php:41
 * @route '/guru-bk'
 */
export const openGuruBk = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: openGuruBk.url(options),
    method: 'get',
})

openGuruBk.definition = {
    methods: ["get","head"],
    url: '/guru-bk',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::openGuruBk
 * @see app/Http/Controllers/DashboardController.php:41
 * @route '/guru-bk'
 */
openGuruBk.url = (options?: RouteQueryOptions) => {
    return openGuruBk.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::openGuruBk
 * @see app/Http/Controllers/DashboardController.php:41
 * @route '/guru-bk'
 */
openGuruBk.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: openGuruBk.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::openGuruBk
 * @see app/Http/Controllers/DashboardController.php:41
 * @route '/guru-bk'
 */
openGuruBk.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: openGuruBk.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::openGuruBk
 * @see app/Http/Controllers/DashboardController.php:41
 * @route '/guru-bk'
 */
    const openGuruBkForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: openGuruBk.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::openGuruBk
 * @see app/Http/Controllers/DashboardController.php:41
 * @route '/guru-bk'
 */
        openGuruBkForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: openGuruBk.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::openGuruBk
 * @see app/Http/Controllers/DashboardController.php:41
 * @route '/guru-bk'
 */
        openGuruBkForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: openGuruBk.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    openGuruBk.form = openGuruBkForm
/**
* @see \App\Http\Controllers\DashboardController::openWaliKelas
 * @see app/Http/Controllers/DashboardController.php:49
 * @route '/wali-kelas'
 */
export const openWaliKelas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: openWaliKelas.url(options),
    method: 'get',
})

openWaliKelas.definition = {
    methods: ["get","head"],
    url: '/wali-kelas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::openWaliKelas
 * @see app/Http/Controllers/DashboardController.php:49
 * @route '/wali-kelas'
 */
openWaliKelas.url = (options?: RouteQueryOptions) => {
    return openWaliKelas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::openWaliKelas
 * @see app/Http/Controllers/DashboardController.php:49
 * @route '/wali-kelas'
 */
openWaliKelas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: openWaliKelas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::openWaliKelas
 * @see app/Http/Controllers/DashboardController.php:49
 * @route '/wali-kelas'
 */
openWaliKelas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: openWaliKelas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::openWaliKelas
 * @see app/Http/Controllers/DashboardController.php:49
 * @route '/wali-kelas'
 */
    const openWaliKelasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: openWaliKelas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::openWaliKelas
 * @see app/Http/Controllers/DashboardController.php:49
 * @route '/wali-kelas'
 */
        openWaliKelasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: openWaliKelas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::openWaliKelas
 * @see app/Http/Controllers/DashboardController.php:49
 * @route '/wali-kelas'
 */
        openWaliKelasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: openWaliKelas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    openWaliKelas.form = openWaliKelasForm
/**
* @see \App\Http\Controllers\DashboardController::openWaliKelasTkj
 * @see app/Http/Controllers/DashboardController.php:57
 * @route '/wali-kelas/tkj'
 */
export const openWaliKelasTkj = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: openWaliKelasTkj.url(options),
    method: 'get',
})

openWaliKelasTkj.definition = {
    methods: ["get","head"],
    url: '/wali-kelas/tkj',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::openWaliKelasTkj
 * @see app/Http/Controllers/DashboardController.php:57
 * @route '/wali-kelas/tkj'
 */
openWaliKelasTkj.url = (options?: RouteQueryOptions) => {
    return openWaliKelasTkj.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::openWaliKelasTkj
 * @see app/Http/Controllers/DashboardController.php:57
 * @route '/wali-kelas/tkj'
 */
openWaliKelasTkj.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: openWaliKelasTkj.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::openWaliKelasTkj
 * @see app/Http/Controllers/DashboardController.php:57
 * @route '/wali-kelas/tkj'
 */
openWaliKelasTkj.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: openWaliKelasTkj.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::openWaliKelasTkj
 * @see app/Http/Controllers/DashboardController.php:57
 * @route '/wali-kelas/tkj'
 */
    const openWaliKelasTkjForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: openWaliKelasTkj.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::openWaliKelasTkj
 * @see app/Http/Controllers/DashboardController.php:57
 * @route '/wali-kelas/tkj'
 */
        openWaliKelasTkjForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: openWaliKelasTkj.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::openWaliKelasTkj
 * @see app/Http/Controllers/DashboardController.php:57
 * @route '/wali-kelas/tkj'
 */
        openWaliKelasTkjForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: openWaliKelasTkj.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    openWaliKelasTkj.form = openWaliKelasTkjForm
/**
* @see \App\Http\Controllers\DashboardController::openKepalaSekolah
 * @see app/Http/Controllers/DashboardController.php:65
 * @route '/kepala-sekolah'
 */
export const openKepalaSekolah = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: openKepalaSekolah.url(options),
    method: 'get',
})

openKepalaSekolah.definition = {
    methods: ["get","head"],
    url: '/kepala-sekolah',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::openKepalaSekolah
 * @see app/Http/Controllers/DashboardController.php:65
 * @route '/kepala-sekolah'
 */
openKepalaSekolah.url = (options?: RouteQueryOptions) => {
    return openKepalaSekolah.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::openKepalaSekolah
 * @see app/Http/Controllers/DashboardController.php:65
 * @route '/kepala-sekolah'
 */
openKepalaSekolah.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: openKepalaSekolah.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::openKepalaSekolah
 * @see app/Http/Controllers/DashboardController.php:65
 * @route '/kepala-sekolah'
 */
openKepalaSekolah.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: openKepalaSekolah.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::openKepalaSekolah
 * @see app/Http/Controllers/DashboardController.php:65
 * @route '/kepala-sekolah'
 */
    const openKepalaSekolahForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: openKepalaSekolah.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::openKepalaSekolah
 * @see app/Http/Controllers/DashboardController.php:65
 * @route '/kepala-sekolah'
 */
        openKepalaSekolahForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: openKepalaSekolah.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::openKepalaSekolah
 * @see app/Http/Controllers/DashboardController.php:65
 * @route '/kepala-sekolah'
 */
        openKepalaSekolahForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: openKepalaSekolah.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    openKepalaSekolah.form = openKepalaSekolahForm
/**
* @see \App\Http\Controllers\DashboardController::openBendahara
 * @see app/Http/Controllers/DashboardController.php:73
 * @route '/bendahara'
 */
export const openBendahara = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: openBendahara.url(options),
    method: 'get',
})

openBendahara.definition = {
    methods: ["get","head"],
    url: '/bendahara',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::openBendahara
 * @see app/Http/Controllers/DashboardController.php:73
 * @route '/bendahara'
 */
openBendahara.url = (options?: RouteQueryOptions) => {
    return openBendahara.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::openBendahara
 * @see app/Http/Controllers/DashboardController.php:73
 * @route '/bendahara'
 */
openBendahara.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: openBendahara.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::openBendahara
 * @see app/Http/Controllers/DashboardController.php:73
 * @route '/bendahara'
 */
openBendahara.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: openBendahara.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::openBendahara
 * @see app/Http/Controllers/DashboardController.php:73
 * @route '/bendahara'
 */
    const openBendaharaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: openBendahara.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::openBendahara
 * @see app/Http/Controllers/DashboardController.php:73
 * @route '/bendahara'
 */
        openBendaharaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: openBendahara.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::openBendahara
 * @see app/Http/Controllers/DashboardController.php:73
 * @route '/bendahara'
 */
        openBendaharaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: openBendahara.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    openBendahara.form = openBendaharaForm
/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:173
 * @route '/dashboard'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:173
 * @route '/dashboard'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:173
 * @route '/dashboard'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:173
 * @route '/dashboard'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:173
 * @route '/dashboard'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:173
 * @route '/dashboard'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:173
 * @route '/dashboard'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\DashboardController::earlyWarning
 * @see app/Http/Controllers/DashboardController.php:196
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
 * @see app/Http/Controllers/DashboardController.php:196
 * @route '/early-warning'
 */
earlyWarning.url = (options?: RouteQueryOptions) => {
    return earlyWarning.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::earlyWarning
 * @see app/Http/Controllers/DashboardController.php:196
 * @route '/early-warning'
 */
earlyWarning.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: earlyWarning.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::earlyWarning
 * @see app/Http/Controllers/DashboardController.php:196
 * @route '/early-warning'
 */
earlyWarning.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: earlyWarning.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::earlyWarning
 * @see app/Http/Controllers/DashboardController.php:196
 * @route '/early-warning'
 */
    const earlyWarningForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: earlyWarning.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::earlyWarning
 * @see app/Http/Controllers/DashboardController.php:196
 * @route '/early-warning'
 */
        earlyWarningForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: earlyWarning.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::earlyWarning
 * @see app/Http/Controllers/DashboardController.php:196
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
 * @see app/Http/Controllers/DashboardController.php:219
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
 * @see app/Http/Controllers/DashboardController.php:219
 * @route '/kondisi-kelas'
 */
kondisiKelas.url = (options?: RouteQueryOptions) => {
    return kondisiKelas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::kondisiKelas
 * @see app/Http/Controllers/DashboardController.php:219
 * @route '/kondisi-kelas'
 */
kondisiKelas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kondisiKelas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::kondisiKelas
 * @see app/Http/Controllers/DashboardController.php:219
 * @route '/kondisi-kelas'
 */
kondisiKelas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: kondisiKelas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::kondisiKelas
 * @see app/Http/Controllers/DashboardController.php:219
 * @route '/kondisi-kelas'
 */
    const kondisiKelasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: kondisiKelas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::kondisiKelas
 * @see app/Http/Controllers/DashboardController.php:219
 * @route '/kondisi-kelas'
 */
        kondisiKelasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: kondisiKelas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::kondisiKelas
 * @see app/Http/Controllers/DashboardController.php:219
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
* @see \App\Http\Controllers\DashboardController::pemantauAtribut
 * @see app/Http/Controllers/DashboardController.php:251
 * @route '/pemantau-atribut'
 */
export const pemantauAtribut = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pemantauAtribut.url(options),
    method: 'get',
})

pemantauAtribut.definition = {
    methods: ["get","head"],
    url: '/pemantau-atribut',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::pemantauAtribut
 * @see app/Http/Controllers/DashboardController.php:251
 * @route '/pemantau-atribut'
 */
pemantauAtribut.url = (options?: RouteQueryOptions) => {
    return pemantauAtribut.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::pemantauAtribut
 * @see app/Http/Controllers/DashboardController.php:251
 * @route '/pemantau-atribut'
 */
pemantauAtribut.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pemantauAtribut.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::pemantauAtribut
 * @see app/Http/Controllers/DashboardController.php:251
 * @route '/pemantau-atribut'
 */
pemantauAtribut.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pemantauAtribut.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::pemantauAtribut
 * @see app/Http/Controllers/DashboardController.php:251
 * @route '/pemantau-atribut'
 */
    const pemantauAtributForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pemantauAtribut.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::pemantauAtribut
 * @see app/Http/Controllers/DashboardController.php:251
 * @route '/pemantau-atribut'
 */
        pemantauAtributForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pemantauAtribut.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::pemantauAtribut
 * @see app/Http/Controllers/DashboardController.php:251
 * @route '/pemantau-atribut'
 */
        pemantauAtributForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pemantauAtribut.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pemantauAtribut.form = pemantauAtributForm
/**
* @see \App\Http\Controllers\DashboardController::alurAts
 * @see app/Http/Controllers/DashboardController.php:387
 * @route '/alur-ats'
 */
export const alurAts = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: alurAts.url(options),
    method: 'get',
})

alurAts.definition = {
    methods: ["get","head"],
    url: '/alur-ats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::alurAts
 * @see app/Http/Controllers/DashboardController.php:387
 * @route '/alur-ats'
 */
alurAts.url = (options?: RouteQueryOptions) => {
    return alurAts.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::alurAts
 * @see app/Http/Controllers/DashboardController.php:387
 * @route '/alur-ats'
 */
alurAts.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: alurAts.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::alurAts
 * @see app/Http/Controllers/DashboardController.php:387
 * @route '/alur-ats'
 */
alurAts.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: alurAts.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::alurAts
 * @see app/Http/Controllers/DashboardController.php:387
 * @route '/alur-ats'
 */
    const alurAtsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: alurAts.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::alurAts
 * @see app/Http/Controllers/DashboardController.php:387
 * @route '/alur-ats'
 */
        alurAtsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: alurAts.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::alurAts
 * @see app/Http/Controllers/DashboardController.php:387
 * @route '/alur-ats'
 */
        alurAtsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: alurAts.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    alurAts.form = alurAtsForm
/**
* @see \App\Http\Controllers\DashboardController::manajemenKasus
 * @see app/Http/Controllers/DashboardController.php:409
 * @route '/manajemen-kasus'
 */
export const manajemenKasus = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manajemenKasus.url(options),
    method: 'get',
})

manajemenKasus.definition = {
    methods: ["get","head"],
    url: '/manajemen-kasus',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::manajemenKasus
 * @see app/Http/Controllers/DashboardController.php:409
 * @route '/manajemen-kasus'
 */
manajemenKasus.url = (options?: RouteQueryOptions) => {
    return manajemenKasus.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::manajemenKasus
 * @see app/Http/Controllers/DashboardController.php:409
 * @route '/manajemen-kasus'
 */
manajemenKasus.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manajemenKasus.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::manajemenKasus
 * @see app/Http/Controllers/DashboardController.php:409
 * @route '/manajemen-kasus'
 */
manajemenKasus.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manajemenKasus.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::manajemenKasus
 * @see app/Http/Controllers/DashboardController.php:409
 * @route '/manajemen-kasus'
 */
    const manajemenKasusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: manajemenKasus.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::manajemenKasus
 * @see app/Http/Controllers/DashboardController.php:409
 * @route '/manajemen-kasus'
 */
        manajemenKasusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: manajemenKasus.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::manajemenKasus
 * @see app/Http/Controllers/DashboardController.php:409
 * @route '/manajemen-kasus'
 */
        manajemenKasusForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: manajemenKasus.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    manajemenKasus.form = manajemenKasusForm
/**
* @see \App\Http\Controllers\DashboardController::komunikasiOrtu
 * @see app/Http/Controllers/DashboardController.php:447
 * @route '/komunikasi-ortu'
 */
export const komunikasiOrtu = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: komunikasiOrtu.url(options),
    method: 'get',
})

komunikasiOrtu.definition = {
    methods: ["get","head"],
    url: '/komunikasi-ortu',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::komunikasiOrtu
 * @see app/Http/Controllers/DashboardController.php:447
 * @route '/komunikasi-ortu'
 */
komunikasiOrtu.url = (options?: RouteQueryOptions) => {
    return komunikasiOrtu.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::komunikasiOrtu
 * @see app/Http/Controllers/DashboardController.php:447
 * @route '/komunikasi-ortu'
 */
komunikasiOrtu.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: komunikasiOrtu.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::komunikasiOrtu
 * @see app/Http/Controllers/DashboardController.php:447
 * @route '/komunikasi-ortu'
 */
komunikasiOrtu.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: komunikasiOrtu.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::komunikasiOrtu
 * @see app/Http/Controllers/DashboardController.php:447
 * @route '/komunikasi-ortu'
 */
    const komunikasiOrtuForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: komunikasiOrtu.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::komunikasiOrtu
 * @see app/Http/Controllers/DashboardController.php:447
 * @route '/komunikasi-ortu'
 */
        komunikasiOrtuForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: komunikasiOrtu.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::komunikasiOrtu
 * @see app/Http/Controllers/DashboardController.php:447
 * @route '/komunikasi-ortu'
 */
        komunikasiOrtuForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: komunikasiOrtu.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    komunikasiOrtu.form = komunikasiOrtuForm
/**
* @see \App\Http\Controllers\DashboardController::dapodik
 * @see app/Http/Controllers/DashboardController.php:469
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
 * @see app/Http/Controllers/DashboardController.php:469
 * @route '/dapodik'
 */
dapodik.url = (options?: RouteQueryOptions) => {
    return dapodik.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::dapodik
 * @see app/Http/Controllers/DashboardController.php:469
 * @route '/dapodik'
 */
dapodik.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dapodik.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::dapodik
 * @see app/Http/Controllers/DashboardController.php:469
 * @route '/dapodik'
 */
dapodik.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dapodik.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::dapodik
 * @see app/Http/Controllers/DashboardController.php:469
 * @route '/dapodik'
 */
    const dapodikForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dapodik.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::dapodik
 * @see app/Http/Controllers/DashboardController.php:469
 * @route '/dapodik'
 */
        dapodikForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dapodik.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::dapodik
 * @see app/Http/Controllers/DashboardController.php:469
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
* @see \App\Http\Controllers\DashboardController::pembayaran
 * @see app/Http/Controllers/DashboardController.php:487
 * @route '/pembayaran'
 */
export const pembayaran = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pembayaran.url(options),
    method: 'get',
})

pembayaran.definition = {
    methods: ["get","head"],
    url: '/pembayaran',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::pembayaran
 * @see app/Http/Controllers/DashboardController.php:487
 * @route '/pembayaran'
 */
pembayaran.url = (options?: RouteQueryOptions) => {
    return pembayaran.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::pembayaran
 * @see app/Http/Controllers/DashboardController.php:487
 * @route '/pembayaran'
 */
pembayaran.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pembayaran.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::pembayaran
 * @see app/Http/Controllers/DashboardController.php:487
 * @route '/pembayaran'
 */
pembayaran.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pembayaran.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::pembayaran
 * @see app/Http/Controllers/DashboardController.php:487
 * @route '/pembayaran'
 */
    const pembayaranForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pembayaran.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::pembayaran
 * @see app/Http/Controllers/DashboardController.php:487
 * @route '/pembayaran'
 */
        pembayaranForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pembayaran.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::pembayaran
 * @see app/Http/Controllers/DashboardController.php:487
 * @route '/pembayaran'
 */
        pembayaranForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pembayaran.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pembayaran.form = pembayaranForm
/**
* @see \App\Http\Controllers\DashboardController::dokumenGuru
 * @see app/Http/Controllers/DashboardController.php:508
 * @route '/dokumen-guru'
 */
export const dokumenGuru = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dokumenGuru.url(options),
    method: 'get',
})

dokumenGuru.definition = {
    methods: ["get","head"],
    url: '/dokumen-guru',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::dokumenGuru
 * @see app/Http/Controllers/DashboardController.php:508
 * @route '/dokumen-guru'
 */
dokumenGuru.url = (options?: RouteQueryOptions) => {
    return dokumenGuru.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::dokumenGuru
 * @see app/Http/Controllers/DashboardController.php:508
 * @route '/dokumen-guru'
 */
dokumenGuru.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dokumenGuru.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::dokumenGuru
 * @see app/Http/Controllers/DashboardController.php:508
 * @route '/dokumen-guru'
 */
dokumenGuru.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dokumenGuru.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::dokumenGuru
 * @see app/Http/Controllers/DashboardController.php:508
 * @route '/dokumen-guru'
 */
    const dokumenGuruForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dokumenGuru.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::dokumenGuru
 * @see app/Http/Controllers/DashboardController.php:508
 * @route '/dokumen-guru'
 */
        dokumenGuruForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dokumenGuru.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::dokumenGuru
 * @see app/Http/Controllers/DashboardController.php:508
 * @route '/dokumen-guru'
 */
        dokumenGuruForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dokumenGuru.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dokumenGuru.form = dokumenGuruForm
/**
* @see \App\Http\Controllers\DashboardController::responsInsiden
 * @see app/Http/Controllers/DashboardController.php:526
 * @route '/respons-insiden'
 */
export const responsInsiden = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: responsInsiden.url(options),
    method: 'get',
})

responsInsiden.definition = {
    methods: ["get","head"],
    url: '/respons-insiden',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::responsInsiden
 * @see app/Http/Controllers/DashboardController.php:526
 * @route '/respons-insiden'
 */
responsInsiden.url = (options?: RouteQueryOptions) => {
    return responsInsiden.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::responsInsiden
 * @see app/Http/Controllers/DashboardController.php:526
 * @route '/respons-insiden'
 */
responsInsiden.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: responsInsiden.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::responsInsiden
 * @see app/Http/Controllers/DashboardController.php:526
 * @route '/respons-insiden'
 */
responsInsiden.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: responsInsiden.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::responsInsiden
 * @see app/Http/Controllers/DashboardController.php:526
 * @route '/respons-insiden'
 */
    const responsInsidenForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: responsInsiden.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::responsInsiden
 * @see app/Http/Controllers/DashboardController.php:526
 * @route '/respons-insiden'
 */
        responsInsidenForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: responsInsiden.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::responsInsiden
 * @see app/Http/Controllers/DashboardController.php:526
 * @route '/respons-insiden'
 */
        responsInsidenForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: responsInsiden.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    responsInsiden.form = responsInsidenForm
/**
* @see \App\Http\Controllers\DashboardController::raporSiswa
 * @see app/Http/Controllers/DashboardController.php:544
 * @route '/rapor-siswa'
 */
export const raporSiswa = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: raporSiswa.url(options),
    method: 'get',
})

raporSiswa.definition = {
    methods: ["get","head"],
    url: '/rapor-siswa',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::raporSiswa
 * @see app/Http/Controllers/DashboardController.php:544
 * @route '/rapor-siswa'
 */
raporSiswa.url = (options?: RouteQueryOptions) => {
    return raporSiswa.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::raporSiswa
 * @see app/Http/Controllers/DashboardController.php:544
 * @route '/rapor-siswa'
 */
raporSiswa.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: raporSiswa.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::raporSiswa
 * @see app/Http/Controllers/DashboardController.php:544
 * @route '/rapor-siswa'
 */
raporSiswa.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: raporSiswa.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::raporSiswa
 * @see app/Http/Controllers/DashboardController.php:544
 * @route '/rapor-siswa'
 */
    const raporSiswaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: raporSiswa.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::raporSiswa
 * @see app/Http/Controllers/DashboardController.php:544
 * @route '/rapor-siswa'
 */
        raporSiswaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: raporSiswa.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::raporSiswa
 * @see app/Http/Controllers/DashboardController.php:544
 * @route '/rapor-siswa'
 */
        raporSiswaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: raporSiswa.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    raporSiswa.form = raporSiswaForm
/**
* @see \App\Http\Controllers\DashboardController::storeFollowup
 * @see app/Http/Controllers/DashboardController.php:1150
 * @route '/followups'
 */
export const storeFollowup = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeFollowup.url(options),
    method: 'post',
})

storeFollowup.definition = {
    methods: ["post"],
    url: '/followups',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::storeFollowup
 * @see app/Http/Controllers/DashboardController.php:1150
 * @route '/followups'
 */
storeFollowup.url = (options?: RouteQueryOptions) => {
    return storeFollowup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::storeFollowup
 * @see app/Http/Controllers/DashboardController.php:1150
 * @route '/followups'
 */
storeFollowup.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeFollowup.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::storeFollowup
 * @see app/Http/Controllers/DashboardController.php:1150
 * @route '/followups'
 */
    const storeFollowupForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeFollowup.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::storeFollowup
 * @see app/Http/Controllers/DashboardController.php:1150
 * @route '/followups'
 */
        storeFollowupForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeFollowup.url(options),
            method: 'post',
        })
    
    storeFollowup.form = storeFollowupForm
/**
* @see \App\Http\Controllers\DashboardController::storeCase
 * @see app/Http/Controllers/DashboardController.php:1177
 * @route '/cases'
 */
export const storeCase = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCase.url(options),
    method: 'post',
})

storeCase.definition = {
    methods: ["post"],
    url: '/cases',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::storeCase
 * @see app/Http/Controllers/DashboardController.php:1177
 * @route '/cases'
 */
storeCase.url = (options?: RouteQueryOptions) => {
    return storeCase.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::storeCase
 * @see app/Http/Controllers/DashboardController.php:1177
 * @route '/cases'
 */
storeCase.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCase.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::storeCase
 * @see app/Http/Controllers/DashboardController.php:1177
 * @route '/cases'
 */
    const storeCaseForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeCase.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::storeCase
 * @see app/Http/Controllers/DashboardController.php:1177
 * @route '/cases'
 */
        storeCaseForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeCase.url(options),
            method: 'post',
        })
    
    storeCase.form = storeCaseForm
/**
* @see \App\Http\Controllers\DashboardController::storeParentCommunication
 * @see app/Http/Controllers/DashboardController.php:1217
 * @route '/parent-communications'
 */
export const storeParentCommunication = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeParentCommunication.url(options),
    method: 'post',
})

storeParentCommunication.definition = {
    methods: ["post"],
    url: '/parent-communications',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::storeParentCommunication
 * @see app/Http/Controllers/DashboardController.php:1217
 * @route '/parent-communications'
 */
storeParentCommunication.url = (options?: RouteQueryOptions) => {
    return storeParentCommunication.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::storeParentCommunication
 * @see app/Http/Controllers/DashboardController.php:1217
 * @route '/parent-communications'
 */
storeParentCommunication.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeParentCommunication.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::storeParentCommunication
 * @see app/Http/Controllers/DashboardController.php:1217
 * @route '/parent-communications'
 */
    const storeParentCommunicationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeParentCommunication.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::storeParentCommunication
 * @see app/Http/Controllers/DashboardController.php:1217
 * @route '/parent-communications'
 */
        storeParentCommunicationForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeParentCommunication.url(options),
            method: 'post',
        })
    
    storeParentCommunication.form = storeParentCommunicationForm
/**
* @see \App\Http\Controllers\DashboardController::storeDisciplineRecord
 * @see app/Http/Controllers/DashboardController.php:972
 * @route '/discipline-records'
 */
export const storeDisciplineRecord = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeDisciplineRecord.url(options),
    method: 'post',
})

storeDisciplineRecord.definition = {
    methods: ["post"],
    url: '/discipline-records',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::storeDisciplineRecord
 * @see app/Http/Controllers/DashboardController.php:972
 * @route '/discipline-records'
 */
storeDisciplineRecord.url = (options?: RouteQueryOptions) => {
    return storeDisciplineRecord.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::storeDisciplineRecord
 * @see app/Http/Controllers/DashboardController.php:972
 * @route '/discipline-records'
 */
storeDisciplineRecord.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeDisciplineRecord.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::storeDisciplineRecord
 * @see app/Http/Controllers/DashboardController.php:972
 * @route '/discipline-records'
 */
    const storeDisciplineRecordForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeDisciplineRecord.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::storeDisciplineRecord
 * @see app/Http/Controllers/DashboardController.php:972
 * @route '/discipline-records'
 */
        storeDisciplineRecordForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeDisciplineRecord.url(options),
            method: 'post',
        })
    
    storeDisciplineRecord.form = storeDisciplineRecordForm
/**
* @see \App\Http\Controllers\DashboardController::followUpDisciplineRecord
 * @see app/Http/Controllers/DashboardController.php:1117
 * @route '/discipline-records/{record}/followup'
 */
export const followUpDisciplineRecord = (args: { record: number | { id: number } } | [record: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: followUpDisciplineRecord.url(args, options),
    method: 'post',
})

followUpDisciplineRecord.definition = {
    methods: ["post"],
    url: '/discipline-records/{record}/followup',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::followUpDisciplineRecord
 * @see app/Http/Controllers/DashboardController.php:1117
 * @route '/discipline-records/{record}/followup'
 */
followUpDisciplineRecord.url = (args: { record: number | { id: number } } | [record: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { record: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { record: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    record: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        record: typeof args.record === 'object'
                ? args.record.id
                : args.record,
                }

    return followUpDisciplineRecord.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::followUpDisciplineRecord
 * @see app/Http/Controllers/DashboardController.php:1117
 * @route '/discipline-records/{record}/followup'
 */
followUpDisciplineRecord.post = (args: { record: number | { id: number } } | [record: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: followUpDisciplineRecord.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::followUpDisciplineRecord
 * @see app/Http/Controllers/DashboardController.php:1117
 * @route '/discipline-records/{record}/followup'
 */
    const followUpDisciplineRecordForm = (args: { record: number | { id: number } } | [record: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: followUpDisciplineRecord.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::followUpDisciplineRecord
 * @see app/Http/Controllers/DashboardController.php:1117
 * @route '/discipline-records/{record}/followup'
 */
        followUpDisciplineRecordForm.post = (args: { record: number | { id: number } } | [record: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: followUpDisciplineRecord.url(args, options),
            method: 'post',
        })
    
    followUpDisciplineRecord.form = followUpDisciplineRecordForm
/**
* @see \App\Http\Controllers\DashboardController::storeStudent
 * @see app/Http/Controllers/DashboardController.php:927
 * @route '/students'
 */
export const storeStudent = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeStudent.url(options),
    method: 'post',
})

storeStudent.definition = {
    methods: ["post"],
    url: '/students',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::storeStudent
 * @see app/Http/Controllers/DashboardController.php:927
 * @route '/students'
 */
storeStudent.url = (options?: RouteQueryOptions) => {
    return storeStudent.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::storeStudent
 * @see app/Http/Controllers/DashboardController.php:927
 * @route '/students'
 */
storeStudent.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeStudent.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::storeStudent
 * @see app/Http/Controllers/DashboardController.php:927
 * @route '/students'
 */
    const storeStudentForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeStudent.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::storeStudent
 * @see app/Http/Controllers/DashboardController.php:927
 * @route '/students'
 */
        storeStudentForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeStudent.url(options),
            method: 'post',
        })
    
    storeStudent.form = storeStudentForm
/**
* @see \App\Http\Controllers\DashboardController::storeReferralToBk
 * @see app/Http/Controllers/DashboardController.php:1016
 * @route '/student-referrals'
 */
export const storeReferralToBk = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeReferralToBk.url(options),
    method: 'post',
})

storeReferralToBk.definition = {
    methods: ["post"],
    url: '/student-referrals',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::storeReferralToBk
 * @see app/Http/Controllers/DashboardController.php:1016
 * @route '/student-referrals'
 */
storeReferralToBk.url = (options?: RouteQueryOptions) => {
    return storeReferralToBk.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::storeReferralToBk
 * @see app/Http/Controllers/DashboardController.php:1016
 * @route '/student-referrals'
 */
storeReferralToBk.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeReferralToBk.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::storeReferralToBk
 * @see app/Http/Controllers/DashboardController.php:1016
 * @route '/student-referrals'
 */
    const storeReferralToBkForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeReferralToBk.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::storeReferralToBk
 * @see app/Http/Controllers/DashboardController.php:1016
 * @route '/student-referrals'
 */
        storeReferralToBkForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeReferralToBk.url(options),
            method: 'post',
        })
    
    storeReferralToBk.form = storeReferralToBkForm
/**
* @see \App\Http\Controllers\DashboardController::handleReferralByBk
 * @see app/Http/Controllers/DashboardController.php:1071
 * @route '/cases/{studentCase}/handle-bk'
 */
export const handleReferralByBk = (args: { studentCase: number | { id: number } } | [studentCase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handleReferralByBk.url(args, options),
    method: 'post',
})

handleReferralByBk.definition = {
    methods: ["post"],
    url: '/cases/{studentCase}/handle-bk',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::handleReferralByBk
 * @see app/Http/Controllers/DashboardController.php:1071
 * @route '/cases/{studentCase}/handle-bk'
 */
handleReferralByBk.url = (args: { studentCase: number | { id: number } } | [studentCase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { studentCase: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { studentCase: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    studentCase: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        studentCase: typeof args.studentCase === 'object'
                ? args.studentCase.id
                : args.studentCase,
                }

    return handleReferralByBk.definition.url
            .replace('{studentCase}', parsedArgs.studentCase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::handleReferralByBk
 * @see app/Http/Controllers/DashboardController.php:1071
 * @route '/cases/{studentCase}/handle-bk'
 */
handleReferralByBk.post = (args: { studentCase: number | { id: number } } | [studentCase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handleReferralByBk.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::handleReferralByBk
 * @see app/Http/Controllers/DashboardController.php:1071
 * @route '/cases/{studentCase}/handle-bk'
 */
    const handleReferralByBkForm = (args: { studentCase: number | { id: number } } | [studentCase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: handleReferralByBk.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::handleReferralByBk
 * @see app/Http/Controllers/DashboardController.php:1071
 * @route '/cases/{studentCase}/handle-bk'
 */
        handleReferralByBkForm.post = (args: { studentCase: number | { id: number } } | [studentCase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: handleReferralByBk.url(args, options),
            method: 'post',
        })
    
    handleReferralByBk.form = handleReferralByBkForm
/**
* @see \App\Http\Controllers\DashboardController::generateAiReport
 * @see app/Http/Controllers/DashboardController.php:1244
 * @route '/student-reports/generate'
 */
export const generateAiReport = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateAiReport.url(options),
    method: 'post',
})

generateAiReport.definition = {
    methods: ["post"],
    url: '/student-reports/generate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::generateAiReport
 * @see app/Http/Controllers/DashboardController.php:1244
 * @route '/student-reports/generate'
 */
generateAiReport.url = (options?: RouteQueryOptions) => {
    return generateAiReport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::generateAiReport
 * @see app/Http/Controllers/DashboardController.php:1244
 * @route '/student-reports/generate'
 */
generateAiReport.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateAiReport.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::generateAiReport
 * @see app/Http/Controllers/DashboardController.php:1244
 * @route '/student-reports/generate'
 */
    const generateAiReportForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: generateAiReport.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::generateAiReport
 * @see app/Http/Controllers/DashboardController.php:1244
 * @route '/student-reports/generate'
 */
        generateAiReportForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: generateAiReport.url(options),
            method: 'post',
        })
    
    generateAiReport.form = generateAiReportForm
/**
* @see \App\Http\Controllers\DashboardController::sendReportToParent
 * @see app/Http/Controllers/DashboardController.php:1324
 * @route '/student-reports/{report}/send'
 */
export const sendReportToParent = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendReportToParent.url(args, options),
    method: 'post',
})

sendReportToParent.definition = {
    methods: ["post"],
    url: '/student-reports/{report}/send',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::sendReportToParent
 * @see app/Http/Controllers/DashboardController.php:1324
 * @route '/student-reports/{report}/send'
 */
sendReportToParent.url = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { report: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { report: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    report: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        report: typeof args.report === 'object'
                ? args.report.id
                : args.report,
                }

    return sendReportToParent.definition.url
            .replace('{report}', parsedArgs.report.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::sendReportToParent
 * @see app/Http/Controllers/DashboardController.php:1324
 * @route '/student-reports/{report}/send'
 */
sendReportToParent.post = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendReportToParent.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::sendReportToParent
 * @see app/Http/Controllers/DashboardController.php:1324
 * @route '/student-reports/{report}/send'
 */
    const sendReportToParentForm = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sendReportToParent.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::sendReportToParent
 * @see app/Http/Controllers/DashboardController.php:1324
 * @route '/student-reports/{report}/send'
 */
        sendReportToParentForm.post = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sendReportToParent.url(args, options),
            method: 'post',
        })
    
    sendReportToParent.form = sendReportToParentForm
/**
* @see \App\Http\Controllers\DashboardController::storePayment
 * @see app/Http/Controllers/DashboardController.php:1359
 * @route '/payments'
 */
export const storePayment = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePayment.url(options),
    method: 'post',
})

storePayment.definition = {
    methods: ["post"],
    url: '/payments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::storePayment
 * @see app/Http/Controllers/DashboardController.php:1359
 * @route '/payments'
 */
storePayment.url = (options?: RouteQueryOptions) => {
    return storePayment.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::storePayment
 * @see app/Http/Controllers/DashboardController.php:1359
 * @route '/payments'
 */
storePayment.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePayment.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::storePayment
 * @see app/Http/Controllers/DashboardController.php:1359
 * @route '/payments'
 */
    const storePaymentForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storePayment.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::storePayment
 * @see app/Http/Controllers/DashboardController.php:1359
 * @route '/payments'
 */
        storePaymentForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storePayment.url(options),
            method: 'post',
        })
    
    storePayment.form = storePaymentForm
/**
* @see \App\Http\Controllers\DashboardController::verifyPayment
 * @see app/Http/Controllers/DashboardController.php:1387
 * @route '/payments/{payment}/verify'
 */
export const verifyPayment = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyPayment.url(args, options),
    method: 'post',
})

verifyPayment.definition = {
    methods: ["post"],
    url: '/payments/{payment}/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::verifyPayment
 * @see app/Http/Controllers/DashboardController.php:1387
 * @route '/payments/{payment}/verify'
 */
verifyPayment.url = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payment: typeof args.payment === 'object'
                ? args.payment.id
                : args.payment,
                }

    return verifyPayment.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::verifyPayment
 * @see app/Http/Controllers/DashboardController.php:1387
 * @route '/payments/{payment}/verify'
 */
verifyPayment.post = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyPayment.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::verifyPayment
 * @see app/Http/Controllers/DashboardController.php:1387
 * @route '/payments/{payment}/verify'
 */
    const verifyPaymentForm = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verifyPayment.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::verifyPayment
 * @see app/Http/Controllers/DashboardController.php:1387
 * @route '/payments/{payment}/verify'
 */
        verifyPaymentForm.post = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verifyPayment.url(args, options),
            method: 'post',
        })
    
    verifyPayment.form = verifyPaymentForm
const DashboardController = { switchRole, openOperator, openGuruBk, openWaliKelas, openWaliKelasTkj, openKepalaSekolah, openBendahara, index, earlyWarning, kondisiKelas, pemantauAtribut, alurAts, manajemenKasus, komunikasiOrtu, dapodik, pembayaran, dokumenGuru, responsInsiden, raporSiswa, storeFollowup, storeCase, storeParentCommunication, storeDisciplineRecord, followUpDisciplineRecord, storeStudent, storeReferralToBk, handleReferralByBk, generateAiReport, sendReportToParent, storePayment, verifyPayment }

export default DashboardController