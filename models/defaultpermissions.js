module.exports.permissions = {
    normal_user: {
        create: [{
                entity_name: 'contacts',
                max_allowed: 1000
            },
            {
                entity_name: 'subscription',
                max_allowed: 100
            }
        ],
        update: [{
                entity_name: 'contacts',
            },
            {
                entity_name: 'subscription'
            }
        ],
        delete: [{
                entity_name: 'contacts',
            },
            {
                entity_name: 'subscription'
            }
        ]
    },
    premium_user: {
        create: [],
        update: [],
        delete: []
    }

}