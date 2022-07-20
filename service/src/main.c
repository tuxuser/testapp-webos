#include "service.h"
#include "log.h"

GMainLoop *gmainLoop;

bool service_method_test(LSHandle* sh, LSMessage* msg, void* ctx)
{
    LSError lserror;
    LSErrorInit(&lserror);

    INFO("Test endpoint called");

    jvalue_ref jobj = jobject_create();
    jobject_set(jobj, j_cstr_to_buffer("returnValue"), jboolean_create(true));

    if(!LSMessageReply(sh, msg, jvalue_tostring_simple(jobj), &lserror))
    {
        ERR("Message reply error!!!");
        LSErrorPrint(&lserror, stdout);

        j_release(&jobj);
        return false;
    }

    j_release(&jobj);
    return true;
}

LSMethod methods[] = {
    {"test", service_method_test, LUNA_METHOD_FLAGS_NONE },
    { 0, 0, 0 }
};

int main()
{
    LSHandle *handle = NULL;
    LSError lserror;

    log_init(LOG_NAME);
    INFO("Starting up...");

    log_set_level(Debug);
    LSErrorInit(&lserror);

    // create a GMainLoop
    gmainLoop = g_main_loop_new(NULL, FALSE);

    bool register_success = false;

    if (&LSRegisterPubPriv != 0) {
        register_success = LSRegisterPubPriv(SERVICE_NAME, &handle, true, lserror);
    } else {
        register_success = LSRegister(SERVICE_NAME, &handle, lserror);
    }

    if (!register_success)
    {
        ERR("Unable to register to luna-bus");
        LSErrorPrint(&lserror, stdout);

        return false;
    }

    INFO("Service registered")

    if (!LSRegisterCategory(handle, "/", methods, NULL, NULL, &lserror))
    {
        ERR("Unable to register category and method");
        LSErrorPrint(&lserror, stdout);

        return false;
    }

    INFO("Category registered")

    if(!LSGmainAttach(handle, gmainLoop, &lserror))
    {
        ERR("Unable to attach service");
        LSErrorPrint(&lserror, stdout);

        return false;
    }

    INFO("Service attached");

    DBG("Going into main loop..");

    // run to check continuously for new events from each of the event sources
    g_main_loop_run(gmainLoop);

    DBG("Main loop quit...");

    if(!LSUnregister(handle, &lserror))
    {
        ERR("Unable to unregister service");
        LSErrorPrint(&lserror, stdout);

        return false;
    }

    LSErrorFree(&lserror);

    // Decreases the reference count on a GMainLoop object by one
    g_main_loop_unref(gmainLoop);
    gmainLoop = NULL;

    DBG("Service main finished");
    return 0;
}
