CosmoRate.Api to projekt REST API zrealizowany w ASP.NET Core. Służy do obsługi kosmetycznych produktów, kategorii oraz recenzji użytkowników. Zawiera pełną obsługę rejestracji, logowania, generowania tokenów JWT, autoryzacji ról (User i Admin), logowania działań oraz elementy bazy danych takie jak procedury składowane, funkcje użytkownika i triggery.

Aby uruchomić projekt, potrzebne są:
– .NET 8 SDK
– SQL Server (LocalDB lub pełna wersja)
– Visual Studio 2022 lub JetBrains Rider
– Git (opcjonalnie)

Aby pobrać projekt, należy wykonać polecenie git clone https://github.com/budajoliwia/CosmoRate.git
, a następnie wejść do folderu CosmoRate.

Konfiguracja bazy danych znajduje się w pliku appsettings.json. W sekcji ConnectionStrings należy ustawić poprawny connection string do lokalnej instancji SQL. Domyślnie projekt korzysta z LocalDB.

Po ustawieniu bazy należy uruchomić migracje, aby utworzyć strukturę tabel. W terminalu należy wykonać polecenie:
dotnet ef database update

Projekt wykorzystuje również procedury składowane, funkcje użytkownika i triggery, które zostały dodane ręcznie w SQL Server.

Przed uruchomieniem projektu należy przywrócić pakiety NuGet. Można to zrobić poprzez Visual Studio (opcja Restore NuGet Packages) lub komendą dotnet restore.

Projekt można uruchomić przez Visual Studio przyciskiem Start lub komendą:
dotnet run --project CosmoRate.Api
Po uruchomieniu API działa pod adresem https://localhost:7080

-------------------------------------------------------------------

