(function () {
    'use strict';

    describe('api helper', function () {
        var $q, $log, $rootScope, apiHelper, notifications;

        beforeEach(module('courses.services'));

        angular.module('courses.notifications', []);
        beforeEach(module(function ($provide) {
            $provide.factory('notifications', function () {
                return jasmine.createSpyObj('notification', [
                    'showError',
                    'showSuccess',
                    'showInfo',
                    'showSpinner',
                    'showErrors',
                    'clear',
                    'remove'
                ]);
            });
        }));

        beforeEach(inject(function (_$rootScope_, _$q_, _$log_, _apiHelper_, _notifications_) {
            notifications = _notifications_;
            apiHelper = _apiHelper_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            $log = _$log_;
        }));

        describe('api call', function () {
            it('should not show loading notification', function () {
                apiHelper.call({
                    notifications: {
                        success: { title: 'Success', message: 'Succeed' },
                        error: { title: 'Error', message: 'Failed' },
                    },
                    action: function () {
                        return fakePrmise(true, {});
                    }
                });

                $rootScope.$apply();
                expect(notifications.showSpinner).not.toHaveBeenCalled();
            });

            it('should not show success notification', function () {
                apiHelper.call({
                    notifications: {
                        spinning: { title: 'Loading', message: '' },
                        error: { title: 'Error', message: 'Failed' },
                    },
                    action: function () {
                        return fakePrmise(true, {});
                    }
                });

                $rootScope.$apply();
                expect(notifications.showSuccess).not.toHaveBeenCalled();
            });

            it('should not show error notification', function () {
                apiHelper.call({
                    notifications: {
                        success: { title: 'Success', message: 'Succeed' },
                        spinning: { title: 'Loading', message: '' },
                    },
                    action: function () {
                        return fakePrmise(false, {});
                    }
                });

                $rootScope.$apply();
                expect(notifications.showError).not.toHaveBeenCalled();
            });

            it('should show loading notification', function () {
                apiHelper.call({
                    notifications: {
                        spinning: { title: 'Loading', message: '' }
                    },
                    action: function () {
                        return fakePrmise(true, {});
                    }
                });

                $rootScope.$apply();
                expect(notifications.showSpinner).toHaveBeenCalled();
            });

            it('should show success notification', function () {
                apiHelper.call({
                    notifications: {
                        success: { title: 'Success', message: 'Succeed' },
                    },
                    action: function () {
                        return fakePrmise(true, {});
                    }
                });

                $rootScope.$apply();
                expect(notifications.showSuccess).toHaveBeenCalled();
            });

            it('should show error notification', function () {
                apiHelper.call({
                    notifications: {
                        error: { title: 'Error', message: 'Failed' },
                    },
                    action: function () {
                        return fakePrmise(false, {});
                    }
                });

                $rootScope.$apply();
                expect(notifications.showError).toHaveBeenCalled();
            });

            it('should show error notification on exception', function () {
                apiHelper.call({
                    notifications: {
                        error: { title: 'Error', message: 'Failed' },
                    },
                    action: function () {
                        throw new Error('Error');
                    }
                });

                $rootScope.$apply();
                expect(notifications.showError).toHaveBeenCalled();
            });

            it('should log error on exception', function () {
                apiHelper.call({
                    notifications: {
                        error: { title: 'Error', message: 'Failed' },
                    },
                    action: function () {
                        throw new Error('Exception');
                    }
                });

                $rootScope.$apply();                
                expect($log.error.logs.length).toBe(1);
            });

            it('should return response.data if it has a value', function () {
                var expectedData = {id: 1, name: 'test'}, actualData;
                apiHelper.call({action: function () {
                    return fakePrmise(true, { data: expectedData });
                    }
                }).then(function (data) {
                    actualData = data;
                });

                $rootScope.$apply();
                expect(actualData).toEqual(expectedData);
            });

            it('should return response.data if data is false', function () {
                var expectedData = false, actualData;
                apiHelper.call({
                    action: function () {
                        return fakePrmise(true, { data: expectedData });
                    }
                }).then(function (data) {
                    actualData = data;
                });

                $rootScope.$apply();
                expect(actualData).toEqual(expectedData);
            });

            it('should return response if data is undefined', function () {
                var expectedData = { id: 1, name: 'test' }, actualData;
                apiHelper.call({
                    action: function () {
                        return fakePrmise(true, expectedData);
                    }
                }).then(function (data) {
                    actualData = data;
                });

                $rootScope.$apply();
                expect(actualData).toEqual(expectedData);
            });
        });

        describe('load', function () {
            it("should not show success notifications if description is undefined", function () {
                apiHelper.load({                    
                    action: function () {
                        return fakePrmise(true, {});
                    }
                });

                $rootScope.$apply();                
                expect(notifications.showSuccess).not.toHaveBeenCalled();
            });

            it("should not show error notifications if description is provided", function () {
                apiHelper.load({
                    action: function () {
                        return fakePrmise(false, {});
                    }
                });

                $rootScope.$apply();                
                expect(notifications.showError).not.toHaveBeenCalled();
            });

            it("should not show spinning notifications if description is provided", function () {
                apiHelper.load({
                    action: function () {
                        return fakePrmise(false, {});
                    }
                });

                $rootScope.$apply();
                expect(notifications.showSpinner).not.toHaveBeenCalled();                
            });

            it("should show success notifications with correct wording", function () {
                apiHelper.load({
                    description: 'customer',
                    action: function () {
                        return fakePrmise(true, {});
                    }
                });

                $rootScope.$apply();
                expect(notifications.showSpinner).toHaveBeenCalledWith('Loading', 'Loading customer');                
            });

            it("should show error notifications with correct wording", function () {
                apiHelper.load({
                    description: 'customer',
                    action: function () {
                        return fakePrmise(false, {});
                    }
                });

                $rootScope.$apply();                
                expect(notifications.showError).toHaveBeenCalledWith('Error!', 'An unexpected error while loading customer.');
            });

            it("should show spinning notifications with correct wording", function () {
                apiHelper.load({
                    description: 'customer',
                    action: function () {
                        return fakePrmise(false, {});
                    }
                });

                $rootScope.$apply();
                expect(notifications.showSpinner).toHaveBeenCalledWith('Loading', 'Loading customer');                
            });
        });

        describe('create', function () {
            it("should not show success notifications if description is undefined", function () {
                apiHelper.create({
                    action: function () {
                        return fakePrmise(true, {});
                    }
                });

                $rootScope.$apply();                
                expect(notifications.showSuccess).not.toHaveBeenCalled();
            });

            it("should not show error notifications if description is provided", function () {
                apiHelper.create({
                    action: function () {
                        return fakePrmise(false, {});
                    }
                });

                $rootScope.$apply();                
                expect(notifications.showError).not.toHaveBeenCalled();
            });

            it("should not show spinning notifications if description is provided", function () {
                apiHelper.create({
                    action: function () {
                        return fakePrmise(false, {});
                    }
                });

                $rootScope.$apply();
                expect(notifications.showSpinner).not.toHaveBeenCalled();
            });

            it("should show success notifications with correct wording", function () {
                apiHelper.create({
                    description: 'customer',
                    action: function () {
                        return fakePrmise(true, {});
                    }
                });

                $rootScope.$apply();
                expect(notifications.showSuccess).toHaveBeenCalledWith('Customer', 'Customer has been created!');
            });

            it("should show error notifications with correct wording", function () {
                apiHelper.create({
                    description: 'customer',
                    action: function () {
                        return fakePrmise(false, {});
                    }
                });

                $rootScope.$apply();
                expect(notifications.showError).toHaveBeenCalledWith('Error!', 'An unexpected error while creating customer.');
            });

            it("should show spinning notifications with correct wording", function () {
                apiHelper.create({
                    description: 'customer',
                    action: function () {
                        return fakePrmise(true, {});
                    }
                });

                $rootScope.$apply();
                expect(notifications.showSpinner).toHaveBeenCalledWith('Saving', 'Saving customer');                
            });
        });

        describe('save', function () {
            it("should not show auccess notifications if description is undefined", function () {
                apiHelper.save({
                    action: function () {
                        return fakePrmise(true, {});
                    }
                });

                $rootScope.$apply();                
                expect(notifications.showSuccess).not.toHaveBeenCalled();
            });

            it("should not show error notifications if description is provided", function () {
                apiHelper.save({
                    action: function () {
                        return fakePrmise(false, {});
                    }
                });

                $rootScope.$apply();                
                expect(notifications.showError).not.toHaveBeenCalled();
            });

            it("should not show spinning notifications if description is provided", function () {
                apiHelper.save({
                    action: function () {
                        return fakePrmise(false, {});
                    }
                });

                $rootScope.$apply();
                expect(notifications.showSpinner).not.toHaveBeenCalled();                
            });

            it("should show success notifications with correct wording", function () {
                apiHelper.save({
                    description: 'customer',
                    action: function () {
                        return fakePrmise(true, {});
                    }
                });

                $rootScope.$apply();                
                expect(notifications.showSuccess).toHaveBeenCalledWith('Customer', 'Customer saved!');
            });

            it("should show error notifications with correct wording", function () {
                apiHelper.save({
                    description: 'customer',
                    action: function () {
                        return fakePrmise(false, {});
                    }
                });

                $rootScope.$apply();                
                expect(notifications.showError).toHaveBeenCalledWith('Error!', 'An unexpected error while saving customer.');
            });

            it("should show spinning notifications with correct wording", function () {
                apiHelper.save({
                    description: 'customer',
                    action: function () {
                        return fakePrmise(true, {});
                    }
                });

                $rootScope.$apply();
                expect(notifications.showSpinner).toHaveBeenCalledWith('Saving', 'Saving changes to customer');                
            });
        });

        describe('delete', function () {
            it("should not show success notifications if description is undefined", function () {
                apiHelper.delete({
                    action: function () {
                        return fakePrmise(true, {});
                    }
                });

                $rootScope.$apply();                
                expect(notifications.showSuccess).not.toHaveBeenCalled();
            });

            it("should not show error notifications if description is provided", function () {
                apiHelper.delete({
                    action: function () {
                        return fakePrmise(false, {});
                    }
                });

                $rootScope.$apply();                
                expect(notifications.showError).not.toHaveBeenCalled();
            });

            it("should not show spinning notifications if description is undefined", function () {
                apiHelper.delete({
                    action: function () {
                        return fakePrmise(true, {});
                    }
                });

                $rootScope.$apply();
                expect(notifications.showSpinner).not.toHaveBeenCalled();                
            });

            it("should show success notifications with correct wording", function () {
                apiHelper.delete({
                    description: 'customer',
                    action: function () {
                        return fakePrmise(true, {});
                    }
                });

                $rootScope.$apply();                
                expect(notifications.showSuccess).toHaveBeenCalledWith('Customer', 'Customer deleted!');
            });

            it("should show error notifications with correct wording", function () {
                apiHelper.delete({
                    description: 'customer',
                    action: function () {
                        return fakePrmise(false, {});
                    }
                });

                $rootScope.$apply();                
                expect(notifications.showError).toHaveBeenCalledWith('Error!', 'An unexpected error while deleting customer.');
            });

            it("should show spinning notifications with correct wording", function () {
                apiHelper.delete({
                    description: 'customer',
                    action: function () {
                        return fakePrmise(true, {});
                    }
                });

                $rootScope.$apply();
                expect(notifications.showSpinner).toHaveBeenCalledWith('Deleting', 'Deleting customer');                
            });
        });

        function fakePrmise(shouldSuccess, dataOrError) {
            return shouldSuccess ? $q.when(dataOrError) : $q.reject(dataOrError);
        }
    });
})();