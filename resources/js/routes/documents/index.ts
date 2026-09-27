import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardController::store
 * @see app/Http/Controllers/DashboardController.php:697
 * @route '/dokumen-guru'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/dokumen-guru',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::store
 * @see app/Http/Controllers/DashboardController.php:697
 * @route '/dokumen-guru'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::store
 * @see app/Http/Controllers/DashboardController.php:697
 * @route '/dokumen-guru'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::store
 * @see app/Http/Controllers/DashboardController.php:697
 * @route '/dokumen-guru'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::store
 * @see app/Http/Controllers/DashboardController.php:697
 * @route '/dokumen-guru'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const documents = {
    store: Object.assign(store, store),
}

export default documents