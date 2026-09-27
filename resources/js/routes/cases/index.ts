import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardController::store
 * @see app/Http/Controllers/DashboardController.php:1335
 * @route '/cases'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/cases',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::store
 * @see app/Http/Controllers/DashboardController.php:1335
 * @route '/cases'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::store
 * @see app/Http/Controllers/DashboardController.php:1335
 * @route '/cases'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::store
 * @see app/Http/Controllers/DashboardController.php:1335
 * @route '/cases'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::store
 * @see app/Http/Controllers/DashboardController.php:1335
 * @route '/cases'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\DashboardController::handleBk
 * @see app/Http/Controllers/DashboardController.php:1229
 * @route '/cases/{studentCase}/handle-bk'
 */
export const handleBk = (args: { studentCase: number | { id: number } } | [studentCase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handleBk.url(args, options),
    method: 'post',
})

handleBk.definition = {
    methods: ["post"],
    url: '/cases/{studentCase}/handle-bk',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::handleBk
 * @see app/Http/Controllers/DashboardController.php:1229
 * @route '/cases/{studentCase}/handle-bk'
 */
handleBk.url = (args: { studentCase: number | { id: number } } | [studentCase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return handleBk.definition.url
            .replace('{studentCase}', parsedArgs.studentCase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::handleBk
 * @see app/Http/Controllers/DashboardController.php:1229
 * @route '/cases/{studentCase}/handle-bk'
 */
handleBk.post = (args: { studentCase: number | { id: number } } | [studentCase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handleBk.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::handleBk
 * @see app/Http/Controllers/DashboardController.php:1229
 * @route '/cases/{studentCase}/handle-bk'
 */
    const handleBkForm = (args: { studentCase: number | { id: number } } | [studentCase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: handleBk.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::handleBk
 * @see app/Http/Controllers/DashboardController.php:1229
 * @route '/cases/{studentCase}/handle-bk'
 */
        handleBkForm.post = (args: { studentCase: number | { id: number } } | [studentCase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: handleBk.url(args, options),
            method: 'post',
        })
    
    handleBk.form = handleBkForm
const cases = {
    store: Object.assign(store, store),
handleBk: Object.assign(handleBk, handleBk),
}

export default cases