#ifndef ChickyCoop_h
#define ChickyCoop_h

#include <Arduino.h>
#include <WiFiManager.h>


class ChickyCoop
{
    public:
    WiFiManager CoopWifi;
    ChickyCoop();
    void InitCoop();
    static void RunCoop(ChickyCoop*);    
    void SetState(int);
    private:
    void _opendoor();
    void _closedoor();
    void _stopdoor();
};

#endif