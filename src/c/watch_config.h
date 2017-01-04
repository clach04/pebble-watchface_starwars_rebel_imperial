#pragma once

#define USE_GENERIC_MAIN
#undef REMOVE_LEADING_ZERO_FROM_TIME  /* 12 hour display will not have a leading '0' or ' ' if this is defined */
#undef FONT_NAME
#undef FONT_SYSTEM_NAME  /* the default font system will be used */
#undef DEBUG_TIME
//#define USE_TIME_MACHINE  // NOTE mixing with DEBUG_TIME doesn't make sense

// Show step count using builtin code
//#define USE_HEALTH
//#define UPDATE_HEALTH_ON_ACTIVITY  /* If not set, only updates step count display once per minute */

#define DRAW_BATTERY
#define DRAW_SMALL_BATTERY

//#define QUIET_TIME_IMAGE RESOURCE_ID_IMAGE_QUIET_TIME
//#define QUIET_TIME_IMAGE_GRECT GRect(20, 20, 20, 20)  // Example assumes a 20x20 image

//#define BG_IMAGE RESOURCE_ID_IMAGE_REBEL // FIXME needs work
#define BG_IMAGE RESOURCE_ID_IMAGE_EMPIRE
#define IMAGE_RES_X 120  /* NOTE if image res changes - this needs to change too! */
#define IMAGE_RES_Y 120  /* NOTE if image res changes - this needs to change too! */

#ifdef PBL_ROUND /* 180x180 */
    #define SCREEN_WIDTH 180
    #define SCREEN_HEIGHT 180
#else /* PBL_RECT 144x168*/
    #define SCREEN_WIDTH 144
    #define SCREEN_HEIGHT 168
#endif /* PBL_RECT */

// image at bottom of screen
#define BG_IMAGE_GRECT GRect((SCREEN_WIDTH - IMAGE_RES_X) / 2, SCREEN_HEIGHT - IMAGE_RES_Y,  IMAGE_RES_X, IMAGE_RES_Y)


#ifdef PBL_ROUND /* 180x180 */
/*TODO center/move right*/
    #define CLOCK_POS GRect(0, 3, 180, 180) /* probably taller than really needed */
    #define HEALTH_POS GRect(0, 40, 180, 180)
    #define BT_POS GRect(0, 100, 180, 180) /* probably taller than really needed */

    #define DATE_ALIGN GTextAlignmentCenter
    #define DATE_POS GRect(0, 120, 180, 180) /* probably taller than really needed */

    #define BAT_ALIGN GTextAlignmentCenter
    #ifdef DRAW_BATTERY
        #define BAT_POS GRect(85, 10, 180, 180) /* probably taller than really needed */
    #else
        #define BAT_POS GRect(0, 140, 180, 180) /* probably taller than really needed */
    #endif /* DRAW_BATTERY */

#else /* PBL_RECT 144x168*/
    /* Clock at top of screen, Image below and centered horizontally */
    #define CLOCK_POS GRect(0, -15, 144, 168)

    #define HEALTH_POS GRect(0, 40, 144, 168)
    #define BT_POS GRect(0, 120, 144, 168) /* probably taller than really needed */

    #define DATE_FMT_STR "%a\n%b\n%d"
    #define MAX_DATE_STR "Thu\nAug\n00"  /* if custom version of DATE_FMT_STR is set, MAX_DATE_STR  needs to be updated too */
    //#define DATE_POS GRect(0, 35, 144, 168) /* probably taller than really needed */
    #define DATE_POS GRect(0, 30, 144, 168) /* probably taller than really needed */

    #ifdef DRAW_BATTERY
        #define BAT_POS GRect(0, 35, 144, 168)
    #else
        #define BAT_POS GRect(0, 35, 144, 168) /* probably taller than really needed */
    #endif /* DRAW_BATTERY */
#endif /* end of Round or rectangle */

/* for screen shots and font testing
#define DEBUG_TIME
#define DEBUG_TIME_SCREENSHOT
 */
