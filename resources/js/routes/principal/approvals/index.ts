import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardController::disposition
 * @see app/Http/Controllers/DashboardController.php:662
 * @route '/persetujuan-sekolah/disposisi'
 */
export const disposition = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: disposition.url(options),
    method: 'post',
})

disposition.definition = {
    methods: ["post"],
    url: '/persetujuan-sekolah/disposisi',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::disposition
 * @see app/Http/Controllers/DashboardController.php:662
 * @route '/persetujuan-sekolah/disposisi'
 */
disposition.url = (options?: RouteQueryOptions) => {
    return disposition.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::disposition
 * @see app/Http/Controllers/DashboardController.php:662
 * @route '/persetujuan-sekolah/disposisi'
 */
disposition.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: disposition.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::disposition
 * @see app/Http/Controllers/DashboardController.php:662
 * @route '/persetujuan-sekolah/disposisi'
 */
    const dispositionForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: disposition.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::disposition
 * @see app/Http/Controllers/DashboardController.php:662
 * @route '/persetujuan-sekolah/disposisi'
 */
        dispositionForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: disposition.url(options),
            method: 'post',
        })
    
    disposition.form = dispositionForm
const approvals = {
    disposition: Object.assign(disposition, disposition),
}

export default approvals