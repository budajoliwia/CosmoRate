CosmoRate.Api to projekt REST API zrealizowany w ASP.NET Core. Służy do obsługi kosmetycznych produktów, kategorii oraz recenzji użytkowników. Zawiera pełną obsługę rejestracji, logowania, generowania tokenów JWT, autoryzacji ról (User i Admin), logowania działań oraz elementy bazy danych takie jak procedury składowane, funkcje użytkownika i triggery.

Aby uruchomić projekt, potrzebne są:
– .NET 8 SDK
– SQL Server (LocalDB lub pełna wersja)
– SQL Server Management Studio (SSMS)
– Visual Studio 2022 lub JetBrains Rider
– Node.js 18+ (dla frontendu)
– Git (opcjonalnie)

Aby pobrać projekt, należy wykonać polecenie:
git clone https://github.com/budajoliwia/CosmoRate.git

a następnie wejść do folderu CosmoRate.

Konfiguracja bazy danych znajduje się w pliku backend/appsettings.json.
W sekcji ConnectionStrings należy ustawić poprawny connection string do lokalnej instancji SQL.
Domyślnie projekt korzysta z LocalDB:

**"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=CosmoRateDb;Trusted_Connection=True;"
}

--------------------------------------------------------------------------
Uruchamianie Bazy Danych

Projekt wykorzystuje bazę danych SQL Server wraz z procedurami składowanymi, funkcjami użytkownika i triggerami.
Elementy te zostały dodane ręcznie, dlatego baza musi zostać odtworzona z pliku SQL.

Wymagany jest:
– SQL Server (LocalDB lub pełna wersja)
– SQL Server Management Studio (SSMS)

W folderze projektu znajduje się plik:
CosmoRateDb.sql
Instrukcja:

Otwórz SSMS
-Połącz się z instancją SQL Server
-Utwórz pustą bazę danych:
CosmoRateDb
-Otwórz plik CosmoRateDb.sql
-Wykonaj cały skrypt przyciskiem Execute (F5)
-Po wykonaniu skryptu baza jest gotowa do użycia.
Nie ma potrzeby uruchamiania migracji EF (dotnet ef database update), jeśli baza została zaimportowana ze skryptu SQL.

------------------------------------------------------------------
Uruchamianie backendu (folder: backend)

Przed uruchomieniem API należy przywrócić paczki NuGet:
dotnet restore

Następnie uruchomić projekt:
dotnet run --project backend/CosmoRate.Api

Po uruchomieniu API działa pod adresem:
https://localhost:7080

--------------------------------------------------------------
Uruchamianie frontendu (folder: frontend)

Wymagane:
– Node.js w wersji min. 18 (zalecane LTS)
– npm (instaluje się razem z Node.js)

Aby uruchomić frontend:
Przejdź w terminalu do folderu frontend:

Zainstaluj zależności:
npm install

Uruchom aplikację:
npm run dev

Vite wystartuje projekt i wyświetli adres

Otwórz ten adres w przeglądarce, aby zobaczyć działający frontend.

-------------------------------------------------------------------
Testy jednostkowe (folder: CosmoRate.Tests)

Projekt zawiera testy jednostkowe znajdujące się w folderze:
CosmoRate.Tests

Do ich uruchomienia nie trzeba instalować dodatkowych pakietów – wszystkie zależności (xUnit, Moq) są pobierane automatycznie przez NuGet.
Testy można uruchomić:
– poprzez Visual Studio (Test Explorer → Run All Tests)
