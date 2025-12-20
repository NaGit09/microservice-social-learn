import { z } from 'zod';
import { UserPermission } from '../../constant/user-permission';

// Helper to create zod enum from typescript enum
const UserPermissionEnum = z.nativeEnum(UserPermission);

export const UpdatePermissionsDtoSchema = z.object({
    permissions: z.array(UserPermissionEnum).min(1, 'At least one permission is required'),
});

export type UpdatePermissionsDto = z.infer<typeof UpdatePermissionsDtoSchema>;
