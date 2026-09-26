import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardController::operator
 * @see app/Http/Controllers/DashboardController.php:32
 * @route '/operator'
 */
export const operator = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: operator.url(options),
    method: 'get',
})

operator.definition = {
    methods: ["get","head"],
    url: '/operator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::operator
 * @see app/Http/Controllers/DashboardController.php:32
 * @route '/operator'
 */
operator.url = (options?: RouteQueryOptions) => {
    return operator.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::operator
 * @see app/Http/Controllers/DashboardController.php:32
 * @route '/operator'
 */
operator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: operator.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::operator
 * @see app/Http/Controllers/DashboardController.php:32
 * @route '/operator'
 */
operator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: operator.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::operator
 * @see app/Http/Controllers/DashboardController.php:32
 * @route '/operator'
 */
    const operatorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: operator.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::operator
 * @see app/Http/Controllers/DashboardController.php:32
 * @route '/operator'
 */
        operatorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: operator.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::operator
 * @see app/Http/Controllers/DashboardController.php:32
 * @route '/operator'
 */
        operatorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: operator.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    operator.form = operatorForm
/**
* @see \App\Http\Controllers\DashboardController::guruBk
 * @see app/Http/Controllers/DashboardController.php:40
 * @route '/guru-bk'
 */
export const guruBk = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: guruBk.url(options),
    method: 'get',
})

guruBk.definition = {
    methods: ["get","head"],
    url: '/guru-bk',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::guruBk
 * @see app/Http/Controllers/DashboardController.php:40
 * @route '/guru-bk'
 */
guruBk.url = (options?: RouteQueryOptions) => {
    return guruBk.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::guruBk
 * @see app/Http/Controllers/DashboardController.php:40
 * @route '/guru-bk'
 */
guruBk.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: guruBk.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::guruBk
 * @see app/Http/Controllers/DashboardController.php:40
 * @route '/guru-bk'
 */
guruBk.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: guruBk.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::guruBk
 * @see app/Http/Controllers/DashboardController.php:40
 * @route '/guru-bk'
 */
    const guruBkForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: guruBk.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::guruBk
 * @see app/Http/Controllers/DashboardController.php:40
 * @route '/guru-bk'
 */
        guruBkForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: guruBk.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::guruBk
 * @see app/Http/Controllers/DashboardController.php:40
 * @route '/guru-bk'
 */
        guruBkForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: guruBk.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    guruBk.form = guruBkForm
/**
* @see \App\Http\Controllers\DashboardController::waliKelas
 * @see app/Http/Controllers/DashboardController.php:48
 * @route '/wali-kelas'
 */
export const waliKelas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: waliKelas.url(options),
    method: 'get',
})

waliKelas.definition = {
    methods: ["get","head"],
    url: '/wali-kelas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::waliKelas
 * @see app/Http/Controllers/DashboardController.php:48
 * @route '/wali-kelas'
 */
waliKelas.url = (options?: RouteQueryOptions) => {
    return waliKelas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::waliKelas
 * @see app/Http/Controllers/DashboardController.php:48
 * @route '/wali-kelas'
 */
waliKelas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: waliKelas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::waliKelas
 * @see app/Http/Controllers/DashboardController.php:48
 * @route '/wali-kelas'
 */
waliKelas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: waliKelas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::waliKelas
 * @see app/Http/Controllers/DashboardController.php:48
 * @route '/wali-kelas'
 */
    const waliKelasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: waliKelas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::waliKelas
 * @see app/Http/Controllers/DashboardController.php:48
 * @route '/wali-kelas'
 */
        waliKelasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: waliKelas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::waliKelas
 * @see app/Http/Controllers/DashboardController.php:48
 * @route '/wali-kelas'
 */
        waliKelasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: waliKelas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    waliKelas.form = waliKelasForm
/**
* @see \App\Http\Controllers\DashboardController::waliKelasTkj
 * @see app/Http/Controllers/DashboardController.php:56
 * @route '/wali-kelas/tkj'
 */
export const waliKelasTkj = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: waliKelasTkj.url(options),
    method: 'get',
})

waliKelasTkj.definition = {
    methods: ["get","head"],
    url: '/wali-kelas/tkj',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::waliKelasTkj
 * @see app/Http/Controllers/DashboardController.php:56
 * @route '/wali-kelas/tkj'
 */
waliKelasTkj.url = (options?: RouteQueryOptions) => {
    return waliKelasTkj.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::waliKelasTkj
 * @see app/Http/Controllers/DashboardController.php:56
 * @route '/wali-kelas/tkj'
 */
waliKelasTkj.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: waliKelasTkj.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::waliKelasTkj
 * @see app/Http/Controllers/DashboardController.php:56
 * @route '/wali-kelas/tkj'
 */
waliKelasTkj.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: waliKelasTkj.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::waliKelasTkj
 * @see app/Http/Controllers/DashboardController.php:56
 * @route '/wali-kelas/tkj'
 */
    const waliKelasTkjForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: waliKelasTkj.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::waliKelasTkj
 * @see app/Http/Controllers/DashboardController.php:56
 * @route '/wali-kelas/tkj'
 */
        waliKelasTkjForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: waliKelasTkj.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::waliKelasTkj
 * @see app/Http/Controllers/DashboardController.php:56
 * @route '/wali-kelas/tkj'
 */
        waliKelasTkjForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: waliKelasTkj.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    waliKelasTkj.form = waliKelasTkjForm
/**
* @see \App\Http\Controllers\DashboardController::kepalaSekolah
 * @see app/Http/Controllers/DashboardController.php:64
 * @route '/kepala-sekolah'
 */
export const kepalaSekolah = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kepalaSekolah.url(options),
    method: 'get',
})

kepalaSekolah.definition = {
    methods: ["get","head"],
    url: '/kepala-sekolah',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::kepalaSekolah
 * @see app/Http/Controllers/DashboardController.php:64
 * @route '/kepala-sekolah'
 */
kepalaSekolah.url = (options?: RouteQueryOptions) => {
    return kepalaSekolah.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::kepalaSekolah
 * @see app/Http/Controllers/DashboardController.php:64
 * @route '/kepala-sekolah'
 */
kepalaSekolah.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kepalaSekolah.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::kepalaSekolah
 * @see app/Http/Controllers/DashboardController.php:64
 * @route '/kepala-sekolah'
 */
kepalaSekolah.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: kepalaSekolah.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::kepalaSekolah
 * @see app/Http/Controllers/DashboardController.php:64
 * @route '/kepala-sekolah'
 */
    const kepalaSekolahForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: kepalaSekolah.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::kepalaSekolah
 * @see app/Http/Controllers/DashboardController.php:64
 * @route '/kepala-sekolah'
 */
        kepalaSekolahForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: kepalaSekolah.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::kepalaSekolah
 * @see app/Http/Controllers/DashboardController.php:64
 * @route '/kepala-sekolah'
 */
        kepalaSekolahForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: kepalaSekolah.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    kepalaSekolah.form = kepalaSekolahForm
/**
* @see \App\Http\Controllers\DashboardController::bendahara
 * @see app/Http/Controllers/DashboardController.php:72
 * @route '/bendahara'
 */
export const bendahara = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bendahara.url(options),
    method: 'get',
})

bendahara.definition = {
    methods: ["get","head"],
    url: '/bendahara',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::bendahara
 * @see app/Http/Controllers/DashboardController.php:72
 * @route '/bendahara'
 */
bendahara.url = (options?: RouteQueryOptions) => {
    return bendahara.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::bendahara
 * @see app/Http/Controllers/DashboardController.php:72
 * @route '/bendahara'
 */
bendahara.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bendahara.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::bendahara
 * @see app/Http/Controllers/DashboardController.php:72
 * @route '/bendahara'
 */
bendahara.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bendahara.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::bendahara
 * @see app/Http/Controllers/DashboardController.php:72
 * @route '/bendahara'
 */
    const bendaharaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: bendahara.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::bendahara
 * @see app/Http/Controllers/DashboardController.php:72
 * @route '/bendahara'
 */
        bendaharaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bendahara.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::bendahara
 * @see app/Http/Controllers/DashboardController.php:72
 * @route '/bendahara'
 */
        bendaharaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bendahara.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    bendahara.form = bendaharaForm
/**
* @see \App\Http\Controllers\DashboardController::switchMethod
 * @see app/Http/Controllers/DashboardController.php:80
 * @route '/switch-role'
 */
export const switchMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: switchMethod.url(options),
    method: 'post',
})

switchMethod.definition = {
    methods: ["post"],
    url: '/switch-role',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::switchMethod
 * @see app/Http/Controllers/DashboardController.php:80
 * @route '/switch-role'
 */
switchMethod.url = (options?: RouteQueryOptions) => {
    return switchMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::switchMethod
 * @see app/Http/Controllers/DashboardController.php:80
 * @route '/switch-role'
 */
switchMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: switchMethod.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::switchMethod
 * @see app/Http/Controllers/DashboardController.php:80
 * @route '/switch-role'
 */
    const switchMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: switchMethod.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::switchMethod
 * @see app/Http/Controllers/DashboardController.php:80
 * @route '/switch-role'
 */
        switchMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: switchMethod.url(options),
            method: 'post',
        })
    
    switchMethod.form = switchMethodForm
const role = {
    operator: Object.assign(operator, operator),
guruBk: Object.assign(guruBk, guruBk),
waliKelas: Object.assign(waliKelas, waliKelas),
waliKelasTkj: Object.assign(waliKelasTkj, waliKelasTkj),
kepalaSekolah: Object.assign(kepalaSekolah, kepalaSekolah),
bendahara: Object.assign(bendahara, bendahara),
switch: Object.assign(switchMethod, switchMethod),
}

export default role