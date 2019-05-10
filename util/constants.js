export const
    defaultOptionsValues = {
        'sortBy': 'relevance'
    },
    flairs = ['media', 'mirror'],
    
    domains = ['streamable', 'streamja', 'clippituser', 'mixtape'],
    
    regexesForPostTitle = [/[\[,\(][0-9]+[\],\)]\s?[-,:]\s?[0-9]+/, /[0-9]+\s?[-,:]\s?[\[,\(][0-9]+[\],\)]/, /[0-9]+\s?[-,:]\s?[0-9]+/],
    
    // copied from https://stackoverflow.com/a/17773849
    regexForUrl = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
    
    mirrorsAuthor = 'AutoModerator',
    
    keywordsForMirrorComments = ['Mirror', 'AA', 'Replay', 'Alternat', 'Angle'],
    
    maxNumOfCommentsForMirrors = 50;