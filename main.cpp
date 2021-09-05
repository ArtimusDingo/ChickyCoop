#include <ChickyCoop.h>
#include <BlynkSimpleEsp8266.h>
#include <Pins.h>

ChickyCoop Coop;
BlynkTimer Timer;
void CoopWrapper();


void setup() 
{
 Coop.InitCoop(); // Connects us to internet
 Blynk.config("");
 Timer.setInterval(100L, CoopWrapper);
}

void CoopWrapper()
{
  ChickyCoop::RunCoop(&Coop);
}

void loop() 
{
  Blynk.run();
  Timer.run();
}

BLYNK_WRITE(V0)
{
  Coop.SetState(param.asInt());
}

BLYNK_WRITE(V1)
{
  Coop.SetState(param.asInt());
}