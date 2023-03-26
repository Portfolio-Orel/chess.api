/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  // Add possible roles, and add a default role for all users.
  // Roles: user, admin, superadmin
    return knex.schema.createTable('roles', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.timestamps(true, true);
    }
    ).then(() => {
        return knex('roles').insert([
            { name: 'user' },
            { name: 'admin' },
            { name: 'superadmin' }
        ]);
    }).then(() => {
        return knex.schema.createTable('users_roles', table => {
            table.increments('id').primary();
            table.uuid('user_id').notNullable();
            table.integer('role_id').notNullable();
            table.timestamps(true, true);
            table.foreign('user_id').references('users.id');
            table.foreign('role_id').references('roles.id');
        });
    }).then(() => {
        // Add a default role for all users by reading all users and adding a role for each user.
        return knex('users').select('id').then(users => {
            const users_roles = users.map(user => {
                return {
                    user_id: user.id,
                    role_id: 1
                };
            });
            return knex('users_roles').insert(users_roles);
        }
        );
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
