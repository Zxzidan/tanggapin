import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardController::generate
 * @see app/Http/Controllers/DashboardController.php:1438
 * @route '/student-reports/generate'
 */
export const generate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generate.url(options),
    method: 'post',
})

generate.definition = {
    methods: ["post"],
    url: '/student-reports/generate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::generate
 * @see app/Http/Controllers/DashboardController.php:1438
 * @route '/student-reports/generate'
 */
generate.url = (options?: RouteQueryOptions) => {
    return generate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::generate
 * @see app/Http/Controllers/DashboardController.php:1438
 * @route '/student-reports/generate'
 */
generate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generate.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::generate
 * @see app/Http/Controllers/DashboardController.php:1438
 * @route '/student-reports/generate'
 */
    const generateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: generate.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::generate
 * @see app/Http/Controllers/DashboardController.php:1438
 * @route '/student-reports/generate'
 */
        generateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: generate.url(options),
            method: 'post',
        })
    
    generate.form = generateForm
/**
* @see \App\Http\Controllers\DashboardController::send
 * @see app/Http/Controllers/DashboardController.php:1518
 * @route '/student-reports/{report}/send'
 */
export const send = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/student-reports/{report}/send',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::send
 * @see app/Http/Controllers/DashboardController.php:1518
 * @route '/student-reports/{report}/send'
 */
send.url = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return send.definition.url
            .replace('{report}', parsedArgs.report.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::send
 * @see app/Http/Controllers/DashboardController.php:1518
 * @route '/student-reports/{report}/send'
 */
send.post = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::send
 * @see app/Http/Controllers/DashboardController.php:1518
 * @route '/student-reports/{report}/send'
 */
    const sendForm = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: send.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::send
 * @see app/Http/Controllers/DashboardController.php:1518
 * @route '/student-reports/{report}/send'
 */
        sendForm.post = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: send.url(args, options),
            method: 'post',
        })
    
    send.form = sendForm
const studentReports = {
    generate: Object.assign(generate, generate),
send: Object.assign(send, send),
}

export default studentReports