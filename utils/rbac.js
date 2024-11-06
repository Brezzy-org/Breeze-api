export const permissions = [
    {
        role: 'user',
        actions: [
            'get_user_profile',
            'update_user_profile',
            'add_mood',
            'get_moods',
            'get_mood',
            'update_mood',
            'delete_mood',


        ]
    },

    {
        role: 'therapist',
        actions: [
            'get_therapist_profile',
            'update_therapist_profile',
            'get_moods',
            'get_mood',
        ]
    }
]