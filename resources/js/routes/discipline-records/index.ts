import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardController::store
 * @see app/Http/Controllers/DashboardController.php:1155
 * @route '/discipline-records'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/discipline-records',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::store
 * @see app/Http/Controllers/DashboardController.php:1155
 * @route '/discipline-records'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::store
 * @see app/Http/Controllers/DashboardController.php:1155
 * @route '/discipline-records'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::store
 * @see app/Http/Controllers/DashboardController.php:1155
 * @route '/discipline-records'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::store
 * @see app/Http/Controllers/DashboardController.php:1155
 * @route '/discipline-records'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\DashboardController::followup
 * @see app/Http/Controllers/DashboardController.php:1300
 * @route '/discipline-records/{record}/followup'
 */
export const followup = (args: { record: number | { id: number } } | [record: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: followup.url(args, options),
    method: 'post',
})

followup.definition = {
    methods: ["post"],
    url: '/discipline-records/{record}/followup',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::followup
 * @see app/Http/Controllers/DashboardController.php:1300
 * @route '/discipline-records/{record}/followup'
 */
followup.url = (args: { record: number | { id: number } } | [record: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return followup.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::followup
 * @see app/Http/Controllers/DashboardController.php:1300
 * @route '/discipline-records/{record}/followup'
 */
followup.post = (args: { record: number | { id: number } } | [record: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: followup.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::followup
 * @see app/Http/Controllers/DashboardController.php:1300
 * @route '/discipline-records/{record}/followup'
 */
    const followupForm = (args: { record: number | { id: number } } | [record: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: followup.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::followup
 * @see app/Http/Controllers/DashboardController.php:1300
 * @route '/discipline-records/{record}/followup'
 */
        followupForm.post = (args: { record: number | { id: number } } | [record: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: followup.url(args, options),
            method: 'post',
        })
    
    followup.form = followupForm
const disciplineRecords = {
    store: Object.assign(store, store),
followup: Object.assign(followup, followup),
}

export default disciplineRecords