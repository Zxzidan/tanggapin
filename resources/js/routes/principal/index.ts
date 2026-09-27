import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import approvalsF41aa7 from './approvals'
/**
* @see \App\Http\Controllers\DashboardController::supervision
 * @see app/Http/Controllers/DashboardController.php:580
 * @route '/supervisi-akademik'
 */
export const supervision = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: supervision.url(options),
    method: 'get',
})

supervision.definition = {
    methods: ["get","head"],
    url: '/supervisi-akademik',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::supervision
 * @see app/Http/Controllers/DashboardController.php:580
 * @route '/supervisi-akademik'
 */
supervision.url = (options?: RouteQueryOptions) => {
    return supervision.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::supervision
 * @see app/Http/Controllers/DashboardController.php:580
 * @route '/supervisi-akademik'
 */
supervision.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: supervision.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::supervision
 * @see app/Http/Controllers/DashboardController.php:580
 * @route '/supervisi-akademik'
 */
supervision.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: supervision.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::supervision
 * @see app/Http/Controllers/DashboardController.php:580
 * @route '/supervisi-akademik'
 */
    const supervisionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: supervision.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::supervision
 * @see app/Http/Controllers/DashboardController.php:580
 * @route '/supervisi-akademik'
 */
        supervisionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: supervision.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::supervision
 * @see app/Http/Controllers/DashboardController.php:580
 * @route '/supervisi-akademik'
 */
        supervisionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: supervision.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    supervision.form = supervisionForm
/**
* @see \App\Http\Controllers\DashboardController::evaluation
 * @see app/Http/Controllers/DashboardController.php:605
 * @route '/evaluasi-sekolah'
 */
export const evaluation = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: evaluation.url(options),
    method: 'get',
})

evaluation.definition = {
    methods: ["get","head"],
    url: '/evaluasi-sekolah',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::evaluation
 * @see app/Http/Controllers/DashboardController.php:605
 * @route '/evaluasi-sekolah'
 */
evaluation.url = (options?: RouteQueryOptions) => {
    return evaluation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::evaluation
 * @see app/Http/Controllers/DashboardController.php:605
 * @route '/evaluasi-sekolah'
 */
evaluation.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: evaluation.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::evaluation
 * @see app/Http/Controllers/DashboardController.php:605
 * @route '/evaluasi-sekolah'
 */
evaluation.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: evaluation.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::evaluation
 * @see app/Http/Controllers/DashboardController.php:605
 * @route '/evaluasi-sekolah'
 */
    const evaluationForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: evaluation.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::evaluation
 * @see app/Http/Controllers/DashboardController.php:605
 * @route '/evaluasi-sekolah'
 */
        evaluationForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: evaluation.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::evaluation
 * @see app/Http/Controllers/DashboardController.php:605
 * @route '/evaluasi-sekolah'
 */
        evaluationForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: evaluation.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    evaluation.form = evaluationForm
/**
* @see \App\Http\Controllers\DashboardController::approvals
 * @see app/Http/Controllers/DashboardController.php:622
 * @route '/persetujuan-sekolah'
 */
export const approvals = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: approvals.url(options),
    method: 'get',
})

approvals.definition = {
    methods: ["get","head"],
    url: '/persetujuan-sekolah',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::approvals
 * @see app/Http/Controllers/DashboardController.php:622
 * @route '/persetujuan-sekolah'
 */
approvals.url = (options?: RouteQueryOptions) => {
    return approvals.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::approvals
 * @see app/Http/Controllers/DashboardController.php:622
 * @route '/persetujuan-sekolah'
 */
approvals.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: approvals.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::approvals
 * @see app/Http/Controllers/DashboardController.php:622
 * @route '/persetujuan-sekolah'
 */
approvals.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: approvals.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::approvals
 * @see app/Http/Controllers/DashboardController.php:622
 * @route '/persetujuan-sekolah'
 */
    const approvalsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: approvals.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::approvals
 * @see app/Http/Controllers/DashboardController.php:622
 * @route '/persetujuan-sekolah'
 */
        approvalsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: approvals.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::approvals
 * @see app/Http/Controllers/DashboardController.php:622
 * @route '/persetujuan-sekolah'
 */
        approvalsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: approvals.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    approvals.form = approvalsForm
const principal = {
    supervision: Object.assign(supervision, supervision),
evaluation: Object.assign(evaluation, evaluation),
approvals: Object.assign(approvals, approvalsF41aa7),
}

export default principal