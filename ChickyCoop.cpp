#include <ChickyCoop.h>
#include <Pins.h>

WiFiManager CoopWifi;
enum State {WAIT = 0, OPEN_DOOR = 1, CLOSE_DOOR = 2};
State state;

ChickyCoop::ChickyCoop()
{

}

void ChickyCoop::InitCoop()
{
  Serial.begin(9600);
  pinMode(OPEN_PIN, OUTPUT);
  pinMode(CLOSE_PIN, OUTPUT);
  CoopWifi.setAPStaticIPConfig(IPAddress(10,0,1,1), IPAddress(10,0,1,1), IPAddress(255,255,255,0));
  CoopWifi.autoConnect("Coop");
}

void ChickyCoop::RunCoop(ChickyCoop* coop)
{
    switch(state)
    {
        case WAIT:
        coop->_stopdoor();
        break;
        case OPEN_DOOR:
        coop->_opendoor();
        state = WAIT;
        break;
        case CLOSE_DOOR:
        coop->_closedoor();
        state = WAIT;
        break;
    }
}
void ChickyCoop::SetState(int _state)
{
    state = static_cast<State>(_state);
}


void ChickyCoop::_opendoor()
{
    digitalWrite(OPEN_PIN, HIGH);
    digitalWrite(CLOSE_PIN, LOW);
}

void ChickyCoop::_closedoor()
{
     digitalWrite(OPEN_PIN, LOW);
     digitalWrite(CLOSE_PIN, HIGH);
}

void ChickyCoop::_stopdoor()
{
     digitalWrite(OPEN_PIN, LOW);
     digitalWrite(CLOSE_PIN, LOW);
}