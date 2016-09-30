
angular.module('sislegisapp').controller('EquipeController', function ($scope, $routeParams, $location, locationParser, EquipeResource, UsuarioResource) {
    var self = this;
    $scope.disabled = false;
    $scope.$location = $location;
    $scope.equipe = $scope.equipe || {};
    $scope.equipe.listaEquipeUsuario = $scope.equipe.listaEquipeUsuario || [];

    $scope.usuariosList = UsuarioResource.queryAll(function (items) {
        $scope.usuariosSelectionList = $.map(items, function (item) {
            return ({
                value: item.id,
                text: item.nome
            });
        });
    });

    $scope.adicionarUsuario = function () {
        var usuarioSelecionado = $scope.usuarioSelecionado;

        if (typeof usuarioSelecionado != 'undefined') {




            $scope.equipe.listaEquipeUsuario.push(usuarioSelecionado);
        }

        $scope.usuarioSelecionado = undefined;
    }

    $scope.removerUsuario = function (equipeUsuario) {
        var index = $scope.equipe.listaEquipeUsuario.indexOf(equipeUsuario);
        $scope.equipe.listaEquipeUsuario.splice(index, 1);
    }

    $scope.get = function () {
        var successCallback = function (data) {
            self.original = data;
            $scope.equipe = new EquipeResource(self.original);
        };
        var errorCallback = function () {
            $location.path("/Equipes");
        };

        EquipeResource.get({ EquipeId: $routeParams.EquipeId }, successCallback, errorCallback);
    };

    $scope.save = function () {
        var successCallback = function (data, responseHeaders) {
            if (!isEditMode()) {
                var id = locationParser(responseHeaders);
                $location.path('/Equipes/edit/' + id);
            }
            $scope.displayError = false;

        };
        var errorCallback = function () {
            $scope.displayError = true;
        };

        if (isEditMode()) {
            $scope.equipe.$update(successCallback, errorCallback);
        } else {
            EquipeResource.save($scope.equipe, successCallback, errorCallback);
        }
    };

    $scope.remove = function () {
        var successCallback = function () {
            $location.path("/Equipes");
            $scope.displayError = false;
        };
        var errorCallback = function () {
            $scope.displayError = true;
        };
        $scope.equipe.$remove(successCallback, errorCallback);
    };

    $scope.cancel = function () {
        $location.path("/Equipes");
    };

    function isEditMode() {
        if ($location.path().indexOf("edit") > -1) {
            return true;
        }
        return false;
    }

    if (isEditMode()) {
        $scope.get();
    }
});

// Caso um usuario ja tenha sido adicionado, nao mostra na combo
angular.module('sislegisapp').filter('removerIncluidos', function () {
    return function (inputArray, filterCriteria) {
        return inputArray.filter(function (item) {
            if (!filterCriteria) {
                return false;
            }

            for (var i = 0; i < filterCriteria.length; i++) {
                if (angular.equals(item.id, filterCriteria[i].id)) {
                    return false;
                }

            }
            return true;
        });
    }
});