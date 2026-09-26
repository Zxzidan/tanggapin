import DashboardController from './DashboardController'
import UserManagementController from './UserManagementController'
import Settings from './Settings'
const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
UserManagementController: Object.assign(UserManagementController, UserManagementController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers