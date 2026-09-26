import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\UserManagementController::index
 * @see app/Http/Controllers/UserManagementController.php:20
 * @route '/kelola-pengguna'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/kelola-pengguna',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserManagementController::index
 * @see app/Http/Controllers/UserManagementController.php:20
 * @route '/kelola-pengguna'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserManagementController::index
 * @see app/Http/Controllers/UserManagementController.php:20
 * @route '/kelola-pengguna'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserManagementController::index
 * @see app/Http/Controllers/UserManagementController.php:20
 * @route '/kelola-pengguna'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\UserManagementController::index
 * @see app/Http/Controllers/UserManagementController.php:20
 * @route '/kelola-pengguna'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\UserManagementController::index
 * @see app/Http/Controllers/UserManagementController.php:20
 * @route '/kelola-pengguna'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\UserManagementController::index
 * @see app/Http/Controllers/UserManagementController.php:20
 * @route '/kelola-pengguna'
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
* @see \App\Http\Controllers\UserManagementController::store
 * @see app/Http/Controllers/UserManagementController.php:83
 * @route '/kelola-pengguna'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/kelola-pengguna',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserManagementController::store
 * @see app/Http/Controllers/UserManagementController.php:83
 * @route '/kelola-pengguna'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserManagementController::store
 * @see app/Http/Controllers/UserManagementController.php:83
 * @route '/kelola-pengguna'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\UserManagementController::store
 * @see app/Http/Controllers/UserManagementController.php:83
 * @route '/kelola-pengguna'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\UserManagementController::store
 * @see app/Http/Controllers/UserManagementController.php:83
 * @route '/kelola-pengguna'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\UserManagementController::update
 * @see app/Http/Controllers/UserManagementController.php:136
 * @route '/kelola-pengguna/{user}'
 */
export const update = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/kelola-pengguna/{user}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\UserManagementController::update
 * @see app/Http/Controllers/UserManagementController.php:136
 * @route '/kelola-pengguna/{user}'
 */
update.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return update.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserManagementController::update
 * @see app/Http/Controllers/UserManagementController.php:136
 * @route '/kelola-pengguna/{user}'
 */
update.put = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\UserManagementController::update
 * @see app/Http/Controllers/UserManagementController.php:136
 * @route '/kelola-pengguna/{user}'
 */
    const updateForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\UserManagementController::update
 * @see app/Http/Controllers/UserManagementController.php:136
 * @route '/kelola-pengguna/{user}'
 */
        updateForm.put = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\UserManagementController::destroy
 * @see app/Http/Controllers/UserManagementController.php:178
 * @route '/kelola-pengguna/{user}'
 */
export const destroy = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/kelola-pengguna/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\UserManagementController::destroy
 * @see app/Http/Controllers/UserManagementController.php:178
 * @route '/kelola-pengguna/{user}'
 */
destroy.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return destroy.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserManagementController::destroy
 * @see app/Http/Controllers/UserManagementController.php:178
 * @route '/kelola-pengguna/{user}'
 */
destroy.delete = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\UserManagementController::destroy
 * @see app/Http/Controllers/UserManagementController.php:178
 * @route '/kelola-pengguna/{user}'
 */
    const destroyForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\UserManagementController::destroy
 * @see app/Http/Controllers/UserManagementController.php:178
 * @route '/kelola-pengguna/{user}'
 */
        destroyForm.delete = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\UserManagementController::storeClass
 * @see app/Http/Controllers/UserManagementController.php:195
 * @route '/kelola-pengguna/kelas'
 */
export const storeClass = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeClass.url(options),
    method: 'post',
})

storeClass.definition = {
    methods: ["post"],
    url: '/kelola-pengguna/kelas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserManagementController::storeClass
 * @see app/Http/Controllers/UserManagementController.php:195
 * @route '/kelola-pengguna/kelas'
 */
storeClass.url = (options?: RouteQueryOptions) => {
    return storeClass.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserManagementController::storeClass
 * @see app/Http/Controllers/UserManagementController.php:195
 * @route '/kelola-pengguna/kelas'
 */
storeClass.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeClass.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\UserManagementController::storeClass
 * @see app/Http/Controllers/UserManagementController.php:195
 * @route '/kelola-pengguna/kelas'
 */
    const storeClassForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeClass.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\UserManagementController::storeClass
 * @see app/Http/Controllers/UserManagementController.php:195
 * @route '/kelola-pengguna/kelas'
 */
        storeClassForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeClass.url(options),
            method: 'post',
        })
    
    storeClass.form = storeClassForm
/**
* @see \App\Http\Controllers\UserManagementController::updatePlan
 * @see app/Http/Controllers/UserManagementController.php:233
 * @route '/kelola-pengguna/paket'
 */
export const updatePlan = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePlan.url(options),
    method: 'post',
})

updatePlan.definition = {
    methods: ["post"],
    url: '/kelola-pengguna/paket',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserManagementController::updatePlan
 * @see app/Http/Controllers/UserManagementController.php:233
 * @route '/kelola-pengguna/paket'
 */
updatePlan.url = (options?: RouteQueryOptions) => {
    return updatePlan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserManagementController::updatePlan
 * @see app/Http/Controllers/UserManagementController.php:233
 * @route '/kelola-pengguna/paket'
 */
updatePlan.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePlan.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\UserManagementController::updatePlan
 * @see app/Http/Controllers/UserManagementController.php:233
 * @route '/kelola-pengguna/paket'
 */
    const updatePlanForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updatePlan.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\UserManagementController::updatePlan
 * @see app/Http/Controllers/UserManagementController.php:233
 * @route '/kelola-pengguna/paket'
 */
        updatePlanForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updatePlan.url(options),
            method: 'post',
        })
    
    updatePlan.form = updatePlanForm
const users = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
storeClass: Object.assign(storeClass, storeClass),
updatePlan: Object.assign(updatePlan, updatePlan),
}

export default users