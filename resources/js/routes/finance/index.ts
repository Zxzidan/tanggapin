import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardController::ai
 * @see app/Http/Controllers/DashboardController.php:519
 * @route '/analisis-keuangan'
 */
export const ai = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ai.url(options),
    method: 'get',
})

ai.definition = {
    methods: ["get","head"],
    url: '/analisis-keuangan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::ai
 * @see app/Http/Controllers/DashboardController.php:519
 * @route '/analisis-keuangan'
 */
ai.url = (options?: RouteQueryOptions) => {
    return ai.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::ai
 * @see app/Http/Controllers/DashboardController.php:519
 * @route '/analisis-keuangan'
 */
ai.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ai.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::ai
 * @see app/Http/Controllers/DashboardController.php:519
 * @route '/analisis-keuangan'
 */
ai.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ai.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::ai
 * @see app/Http/Controllers/DashboardController.php:519
 * @route '/analisis-keuangan'
 */
    const aiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ai.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::ai
 * @see app/Http/Controllers/DashboardController.php:519
 * @route '/analisis-keuangan'
 */
        aiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ai.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::ai
 * @see app/Http/Controllers/DashboardController.php:519
 * @route '/analisis-keuangan'
 */
        aiForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ai.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ai.form = aiForm
/**
* @see \App\Http\Controllers\DashboardController::reports
 * @see app/Http/Controllers/DashboardController.php:549
 * @route '/laporan-keuangan'
 */
export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

reports.definition = {
    methods: ["get","head"],
    url: '/laporan-keuangan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::reports
 * @see app/Http/Controllers/DashboardController.php:549
 * @route '/laporan-keuangan'
 */
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::reports
 * @see app/Http/Controllers/DashboardController.php:549
 * @route '/laporan-keuangan'
 */
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::reports
 * @see app/Http/Controllers/DashboardController.php:549
 * @route '/laporan-keuangan'
 */
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::reports
 * @see app/Http/Controllers/DashboardController.php:549
 * @route '/laporan-keuangan'
 */
    const reportsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reports.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::reports
 * @see app/Http/Controllers/DashboardController.php:549
 * @route '/laporan-keuangan'
 */
        reportsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reports.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::reports
 * @see app/Http/Controllers/DashboardController.php:549
 * @route '/laporan-keuangan'
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
/**
* @see \App\Http\Controllers\DashboardController::reminder
 * @see app/Http/Controllers/DashboardController.php:565
 * @route '/reminder-spp'
 */
export const reminder = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reminder.url(options),
    method: 'get',
})

reminder.definition = {
    methods: ["get","head"],
    url: '/reminder-spp',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::reminder
 * @see app/Http/Controllers/DashboardController.php:565
 * @route '/reminder-spp'
 */
reminder.url = (options?: RouteQueryOptions) => {
    return reminder.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::reminder
 * @see app/Http/Controllers/DashboardController.php:565
 * @route '/reminder-spp'
 */
reminder.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reminder.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::reminder
 * @see app/Http/Controllers/DashboardController.php:565
 * @route '/reminder-spp'
 */
reminder.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reminder.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::reminder
 * @see app/Http/Controllers/DashboardController.php:565
 * @route '/reminder-spp'
 */
    const reminderForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reminder.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::reminder
 * @see app/Http/Controllers/DashboardController.php:565
 * @route '/reminder-spp'
 */
        reminderForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reminder.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::reminder
 * @see app/Http/Controllers/DashboardController.php:565
 * @route '/reminder-spp'
 */
        reminderForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reminder.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reminder.form = reminderForm
const finance = {
    ai: Object.assign(ai, ai),
reports: Object.assign(reports, reports),
reminder: Object.assign(reminder, reminder),
}

export default finance