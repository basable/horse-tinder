set -euo pipefail

# Backend
cd backend
rm -f go.sum
go mod tidy
go build -o /dev/null ./...
go vet ./...
go test ./...
cd ..

# Frontend
cd frontend
rm -f package-lock.json
npm install
npm run build
cd ..

# Images
docker build -t horse-tinder-backend backend
docker build -t horse-tinder-frontend frontend
